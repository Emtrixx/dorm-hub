export default {
    fetchPosts(state,payload) {
        state.posts = payload.post;
    }
}