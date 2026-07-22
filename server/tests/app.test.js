import { beforeAll, afterAll, describe, it, expect } from 'vitest'
import request from 'supertest'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import app from '../app.js'

// use the models app.js registered — importing the model files here would
// register them a second time through vitest's module graph
const User = mongoose.model('User')
const Hub = mongoose.model('Hub')
const Post = mongoose.model('Post')
const Comment = mongoose.model('Comment')
const News = mongoose.model('News')

let mongod

beforeAll(async () => {
  mongod = await MongoMemoryServer.create()
  await mongoose.connect(mongod.getUri('dorm-hub-test'))
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongod.stop()
})

describe('general', () => {
  it('responds on /', async () => {
    const res = await request(app).get('/')
    expect(res.status).toBe(200)
  })
})

describe('blackboard (public)', () => {
  it('lists hubs on /blackboard/all', async () => {
    await new Hub({ name: 'general' }).save()
    const res = await request(app).get('/blackboard/all')
    expect(res.status).toBe(200)
    expect(JSON.parse(res.text).map(h => h.name)).toContain('general')
  })

  it('returns a hub with its posts on /blackboard/:hub', async () => {
    const hub = await Hub.findOne({ name: 'general' })
    const post = await new Post({ title: 'Hello', text: 'World', hub: hub._id }).save()
    hub.posts.push(post._id)
    await hub.save()

    const res = await request(app).get('/blackboard/general')
    expect(res.status).toBe(200)
    const body = JSON.parse(res.text)
    expect(body.name).toBe('general')
    expect(body.posts[0].title).toBe('Hello')
  })
})

describe('secure routes', () => {
  it('rejects requests without a token', async () => {
    const res = await request(app).get('/blackboard/secure/myPosts')
    expect(res.status).toBe(401)
  })

  it('logs in a registered user and grants access with the token', async () => {
    const user = new User({ email: 'test@example.com', firstName: 'Test', lastName: 'User' })
    await User.register(user, 'password123')

    const login = await request(app)
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'password123' })
    expect(login.status).toBe(200)
    expect(login.body.token).toBeTruthy()
    expect(login.body.roles).toEqual([])

    const profile = await request(app)
      .get('/blackboard/secure/profile')
      .set('Authorization', `Bearer ${login.body.token}`)
    expect(profile.status).toBe(200)
  })

  it('rejects a login with a wrong password', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'wrong' })
    expect(res.status).toBe(401)
  })
})

describe('news', () => {
  it('lists news on /news/all', async () => {
    const res = await request(app).get('/news/all')
    expect(res.status).toBe(200)
    expect(Array.isArray(JSON.parse(res.text))).toBe(true)
  })
})

describe('roles', () => {
  let plainToken
  let editorToken

  async function login(email, password) {
    const res = await request(app).post('/auth/login').send({ email, password })
    expect(res.status).toBe(200)
    return res.body.token
  }

  beforeAll(async () => {
    // test@example.com (no roles) exists from the secure-routes tests
    plainToken = await login('test@example.com', 'password123')
    const editor = new User({
      email: 'editor@example.com',
      firstName: 'Edith',
      lastName: 'Tor',
      roles: ['news', 'wiki', 'hubs']
    })
    await User.register(editor, 'password123')
    editorToken = await login('editor@example.com', 'password123')
  })

  it('reports roles in the login response', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'editor@example.com', password: 'password123' })
    expect(res.body.roles).toEqual(['news', 'wiki', 'hubs'])
  })

  it('rejects wiki edits without the wiki role', async () => {
    const res = await request(app)
      .post('/wiki/secure/addCategory')
      .set('Authorization', `Bearer ${plainToken}`)
      .send({ name: 'Forbidden' })
    expect(res.status).toBe(403)
  })

  it('lets a wiki editor create and list a category', async () => {
    const create = await request(app)
      .post('/wiki/secure/addCategory')
      .set('Authorization', `Bearer ${editorToken}`)
      .send({ name: 'AGs' })
    expect(create.status).toBe(200)

    const res = await request(app).get('/wiki/all')
    expect(res.status).toBe(200)
    expect(JSON.parse(res.text).map(c => c.name)).toContain('AGs')
  })

  it('rejects news creation without the news role', async () => {
    const res = await request(app)
      .post('/news/secure')
      .set('Authorization', `Bearer ${plainToken}`)
      .send({ title: 'Nope', content: [] })
    expect(res.status).toBe(403)
  })

  it('lets a news editor create a news item', async () => {
    const create = await request(app)
      .post('/news/secure')
      .set('Authorization', `Bearer ${editorToken}`)
      .send({ title: 'Grand opening', content: [{ contentType: 'text', content: 'Hello dorm!' }] })
    expect(create.status).toBe(200)

    const list = await request(app).get('/news/all')
    expect(JSON.parse(list.text).map(n => n.title)).toContain('Grand opening')
  })

  it('rejects hub creation without the hubs role', async () => {
    const res = await request(app)
      .post('/blackboard/secure/hubs')
      .set('Authorization', `Bearer ${plainToken}`)
      .send({ name: 'forbidden-hub' })
    expect(res.status).toBe(403)
  })

  it('lets a hub manager create a hub, refusing duplicates', async () => {
    const create = await request(app)
      .post('/blackboard/secure/hubs')
      .set('Authorization', `Bearer ${editorToken}`)
      .send({ name: 'gaming' })
    expect(create.status).toBe(200)

    const dupe = await request(app)
      .post('/blackboard/secure/hubs')
      .set('Authorization', `Bearer ${editorToken}`)
      .send({ name: 'gaming' })
    expect(dupe.status).toBe(409)

    const hubs = await request(app).get('/blackboard/all')
    expect(JSON.parse(hubs.text).map(h => h.name)).toContain('gaming')
  })

  it('lets a hub manager delete a hub', async () => {
    const res = await request(app)
      .delete('/blackboard/secure/hubs/gaming')
      .set('Authorization', `Bearer ${editorToken}`)
    expect(res.status).toBe(200)

    const hubs = await request(app).get('/blackboard/all')
    expect(JSON.parse(hubs.text).map(h => h.name)).not.toContain('gaming')
  })
})

describe('news authoring and comments', () => {
  let plainToken
  let editorToken
  let newsId

  async function login(email) {
    const res = await request(app).post('/auth/login').send({ email, password: 'password123' })
    expect(res.status).toBe(200)
    return res.body.token
  }

  beforeAll(async () => {
    // users were registered by the earlier describe blocks
    plainToken = await login('test@example.com')
    editorToken = await login('editor@example.com')

    const create = await request(app)
      .post('/news/secure')
      .set('Authorization', `Bearer ${editorToken}`)
      .send({ title: 'Draft', content: [{ contentType: 'text', content: 'v1' }] })
    expect(create.status).toBe(200)
    newsId = create.body._id
  })

  it('lets a news editor update a news item', async () => {
    const res = await request(app)
      .post(`/news/secure/${newsId}`)
      .set('Authorization', `Bearer ${editorToken}`)
      .send({ title: 'Updated', content: [{ contentType: 'text', content: 'v2' }, { contentType: 'img', content: 'http://example.com/a.jpg' }] })
    expect(res.status).toBe(200)
    expect(res.body.title).toBe('Updated')
    expect(res.body.content).toHaveLength(2)
  })

  it('rejects updates without the news role', async () => {
    const res = await request(app)
      .post(`/news/secure/${newsId}`)
      .set('Authorization', `Bearer ${plainToken}`)
      .send({ title: 'Hijacked', content: [] })
    expect(res.status).toBe(403)
  })

  it('lets any logged-in user comment, stamping the author from the JWT', async () => {
    const res = await request(app)
      .post(`/news/secure/${newsId}/comments`)
      .set('Authorization', `Bearer ${plainToken}`)
      .send({ text: 'Nice one', author: 'spoofed' })
    expect(res.status).toBe(200)
    const plainUser = await User.findOne({ email: 'test@example.com' })
    expect(res.body.author).toBe(plainUser._id.toString())
  })

  it('rejects comments without a token', async () => {
    const res = await request(app)
      .post(`/news/secure/${newsId}/comments`)
      .send({ text: 'anon' })
    expect(res.status).toBe(401)
  })

  it('only lets the author or a news editor delete a comment', async () => {
    const editorComment = await request(app)
      .post(`/news/secure/${newsId}/comments`)
      .set('Authorization', `Bearer ${editorToken}`)
      .send({ text: 'editorial note' })
    expect(editorComment.status).toBe(200)

    const forbidden = await request(app)
      .delete(`/news/secure/comments/${editorComment.body._id}`)
      .set('Authorization', `Bearer ${plainToken}`)
    expect(forbidden.status).toBe(403)

    const allowed = await request(app)
      .delete(`/news/secure/comments/${editorComment.body._id}`)
      .set('Authorization', `Bearer ${editorToken}`)
    expect(allowed.status).toBe(200)

    const news = await News.findById(newsId)
    expect(news.comments.map(String)).not.toContain(editorComment.body._id)
  })

  it('deleting a news item also deletes its comments', async () => {
    const news = await News.findById(newsId)
    const commentIds = news.comments

    const res = await request(app)
      .delete(`/news/secure/${newsId}`)
      .set('Authorization', `Bearer ${editorToken}`)
    expect(res.status).toBe(200)
    expect(await News.findById(newsId)).toBeNull()
    expect(await Comment.countDocuments({ _id: { $in: commentIds } })).toBe(0)
  })
})

describe('blackboard post and comment permissions', () => {
  let authorToken
  let strangerToken
  let moderatorToken
  let postId

  async function login(email) {
    const res = await request(app).post('/auth/login').send({ email, password: 'password123' })
    expect(res.status).toBe(200)
    return res.body.token
  }

  beforeAll(async () => {
    authorToken = await login('test@example.com')
    moderatorToken = await login('editor@example.com')

    const stranger = new User({ email: 'stranger@example.com', firstName: 'Stran', lastName: 'Ger' })
    await User.register(stranger, 'password123')
    strangerToken = await login('stranger@example.com')

    await new Hub({ name: 'permtest' }).save()
    const res = await request(app)
      .get('/blackboard/secure/new-post-id/permtest')
      .set('Authorization', `Bearer ${authorToken}`)
    expect(res.status).toBe(200)
    postId = JSON.parse(res.text)
  })

  it('stamps the author of new posts from the JWT', async () => {
    const author = await User.findOne({ email: 'test@example.com' })
    const post = await Post.findById(postId)
    expect(post.author.toString()).toBe(author._id.toString())
  })

  it('lets the author edit their post but rejects others', async () => {
    const edit = await request(app)
      .post('/blackboard/secure/setPost')
      .set('Authorization', `Bearer ${authorToken}`)
      .send({ _id: postId, title: 'Mine', text: 'my text' })
    expect(edit.status).toBe(200)

    const forbidden = await request(app)
      .post('/blackboard/secure/setPost')
      .set('Authorization', `Bearer ${strangerToken}`)
      .send({ _id: postId, title: 'Not yours', text: 'nope' })
    expect(forbidden.status).toBe(403)

    const moderated = await request(app)
      .post('/blackboard/secure/setPost')
      .set('Authorization', `Bearer ${moderatorToken}`)
      .send({ _id: postId, title: 'Moderated', text: 'cleaned up' })
    expect(moderated.status).toBe(200)
  })

  it('lets author or moderator delete comments, but not others', async () => {
    const comment = await request(app)
      .post(`/blackboard/secure/permtest/${postId}`)
      .set('Authorization', `Bearer ${authorToken}`)
      .send({ text: 'my comment', author: 'spoofed' })
    expect(comment.status).toBe(200)

    const forbidden = await request(app)
      .delete(`/blackboard/secure/comments/${comment.body._id}`)
      .set('Authorization', `Bearer ${strangerToken}`)
    expect(forbidden.status).toBe(403)

    const allowed = await request(app)
      .delete(`/blackboard/secure/comments/${comment.body._id}`)
      .set('Authorization', `Bearer ${authorToken}`)
    expect(allowed.status).toBe(200)

    const post = await Post.findById(postId)
    expect(post.comments.map(String)).not.toContain(comment.body._id)
  })

  it('rejects post deletion by non-authors and completes it for the author', async () => {
    const comment = await request(app)
      .post(`/blackboard/secure/permtest/${postId}`)
      .set('Authorization', `Bearer ${strangerToken}`)
      .send({ text: 'left behind?' })
    expect(comment.status).toBe(200)

    const forbidden = await request(app)
      .delete(`/blackboard/secure/permtest/${postId}`)
      .set('Authorization', `Bearer ${strangerToken}`)
    expect(forbidden.status).toBe(403)

    const allowed = await request(app)
      .delete(`/blackboard/secure/permtest/${postId}`)
      .set('Authorization', `Bearer ${authorToken}`)
    expect(allowed.status).toBe(200)

    expect(await Post.findById(postId)).toBeNull()
    expect(await Comment.findById(comment.body._id)).toBeNull()
    const hub = await Hub.findOne({ name: 'permtest' })
    expect(hub.posts.map(String)).not.toContain(postId)
  })
})

