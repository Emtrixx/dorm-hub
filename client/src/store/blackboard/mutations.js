export default {
    fetchHub(state,payload) {
        state.hub = payload.hub;
    },
    createPost(state,payload) {
        state.hub.posts.push(payload)
    },
    fetchPost(state,payload) {
        state.post = payload.post
    }
}