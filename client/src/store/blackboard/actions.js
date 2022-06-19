export default {
    async fetchHub(context, payload) {
        let url = process.env.VUE_APP_HOST || "http://localhost:8081/";
        const res = await fetch(url + 'blackboard/'+payload.hub)
        const resData = await res.json();

        if(!res.ok) {
            const error = new Error(resData.message || 'Failed to fetch Hub!')
            console.log(error.message);
            throw error        
        }

        context.commit('fetchHub', {hub: resData})
    },
    async fetchPost(context,payload) {
        let url = process.env.VUE_APP_HOST || "http://localhost:8081/";
        const res = await fetch(url + `blackboard/${payload.hub}/${payload.postId}`)
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
        let url = process.env.VUE_APP_HOST || "http://localhost:8081/";
        const res = await fetch(url + 'blackboard-secure/'+payload.hub, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + localStorage.getItem('token')
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
    },
}