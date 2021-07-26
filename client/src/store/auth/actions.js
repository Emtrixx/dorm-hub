let timer;

export default {
    async signup(context, payload) {
        return context.dispatch('auth', {body: payload, mode: 'register'})
    },
    async login(context, payload) {
        return context.dispatch('auth', { body: payload, mode: 'login'})
    },
    async auth(context, payload) {
        const res = await fetch('http://localhost:8081/'+payload.mode, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(payload.body)
        })
        const resData = await res.json()

        if(!res.ok) {
            const error = new Error(resData.message || 'Failed to authenticate!')
            console.log(error.message);
            throw error        
        }

        const expiresIn = +resData.expiresIn
        // const expiresIn = 20000
        const expirationDate = Date.now() + expiresIn

        localStorage.setItem('token', resData.token)
        localStorage.setItem('userId', resData.userId)
        localStorage.setItem('tokenExpiration', expirationDate)

        timer = setTimeout(() => {
            context.dispatch('autoLogout')
        }, expiresIn)

        context.commit('setUser', {
            token: resData.token,
            userId: resData.userId,
        })
    },


    tryLogin(context) {
        const token = localStorage.getItem('token')
        const userId = localStorage.getItem('userId')
        const tokenExpiration = localStorage.getItem('tokenExpiration')

        const expiresIn = +tokenExpiration - Date.now()

        if (expiresIn < 1000) {
            return
        }

        timer = setTimeout(() => {
            context.dispatch('autoLogout')
        }, expiresIn)

        if (token && userId) {
            context.commit('setUser', {
                token,
                userId,
            })
        }
    },


    logout(context) {
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        localStorage.removeItem('tokenExpiration')

        clearTimeout(timer)

        context.commit('setUser', {
            token: null,
            userId: null,
        })
    },


    autoLogout(context) {
       context.dispatch('logout')
       context.commit('setAutoLogout')
    }
}