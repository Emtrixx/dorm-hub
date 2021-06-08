export default {
    async fetchHub(context, payload) {
        const res = await fetch('http://localhost:8081/blackboard/'+payload.hub)
        const resData = await res.json();

        if(!res.ok) {
            const error = new Error(resData.message || 'Failed to fetch Hub!')
            console.log(error.message);
            throw error        
        }

        context.commit('fetchHub', {hub: resData})
    },
    async fetchPost(context,payload) {
        const res = await fetch(`http://localhost:8081/blackboard/${payload.hub}/${payload.postId}`)
        const resData = await res.json()

        if(!res.ok) {
            const error = new Error(resData.message || 'Failed to fetch post!')
            console.log(error.message);
            throw error        
        }

        console.log(resData)
        context.commit('fetchPost', {post: resData})
    },
    async createPost(context, payload) {
        const res = await fetch('http://localhost:8081/blackboard/'+payload.hub, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(payload.data)
        })

        const resData = await res.json()

        if(!res.ok) {
            const error = new Error(resData.message || 'Failed to create post!')
            console.log(error.message);
            throw error        
        }

        context.commit('createPost', resData)
    }
}