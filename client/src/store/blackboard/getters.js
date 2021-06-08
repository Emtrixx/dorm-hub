export default {
    getHub(state) {
        return state.hub;
    },
    getPosts(state) {
        console.log(state.hub.posts)
        return state.hub.posts;
    },
    getPost(state) {
        return state.post;
    }
}