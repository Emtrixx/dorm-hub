export default {
    async fetchPosts(context, payload) {
        const res = await fetch('http://localhost:8081/blackboard/'+payload.hub)
        const resData = await res.json();

        // const resData = [{
        //     title: 'Test',
        //     message: 'Erste Nachricht'
        // }]
        console.log(resData);
        context.commit('fetchPosts', {post: resData})
    }
}