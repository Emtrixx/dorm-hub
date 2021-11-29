export default {
    async fetchNewsItem(context,payload) {
        const res = await fetch(process.env.VUE_APP_HOST + `news/${payload.newsId}`)
        const resData = await res.json()
        
        console.log(resData)

        context.commit('fetchNewsItem', {newsItem: resData})
    }
}