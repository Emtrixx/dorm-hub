export default {
    fetchHub(state,payload) {
        state.hub = payload.hub;
    },
    createPost(state,payload) {
        console.log(payload)
        state.hub.posts.push(payload)
    }
}