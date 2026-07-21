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

describe('wiki', () => {
  it('creates and lists a category', async () => {
    const create = await request(app)
      .post('/wiki/addCategory')
      .send({ name: 'AGs' })
    expect(create.status).toBe(200)

    const res = await request(app).get('/wiki/all')
    expect(res.status).toBe(200)
    expect(JSON.parse(res.text).map(c => c.name)).toContain('AGs')
  })
})
