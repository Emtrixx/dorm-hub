export default {
    async fetchNewsItem(context,payload) {
        const res = await fetch(import.meta.env.VITE_HOST + `news/${payload.newsId}`)
        const resData = await res.json()
        
        console.log(resData)

        context.commit('fetchNewsItem', {newsItem: resData})
    }
}