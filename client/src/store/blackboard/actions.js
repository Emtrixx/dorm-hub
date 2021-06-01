export default {
    async fetchHub(context, payload) {
        const res = await fetch('http://localhost:8081/blackboard/'+payload.hub)
        const resData = await res.json();

        console.log(resData);
        context.commit('fetchHub', {hub: resData})
    }
}