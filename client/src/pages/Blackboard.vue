<template>
    <div>
        <div>
            <div class="btn-group my-3 flex-wrap">
                <router-link class="btn btn-primary" to="/blackboard/all">All</router-link>
                <router-link
                    v-for="hub in hubs"
                    :key="hub._id"
                    class="btn btn-primary"
                    :to="'/blackboard/' + hub.name + '/index'"
                >{{ hubLabel(hub.name) }}</router-link>
                <router-link v-if="isAuthenticated" class="btn btn-dark" to="/blackboard/my-hubs">My Hubs</router-link>
                <button v-if="canManageHubs && !addingHub" class="btn btn-outline-dark" @click="addingHub = true">
                    <i class="bi bi-plus-lg"></i> Add hub
                </button>
            </div>
            <div v-if="addingHub" class="input-group my-2" style="max-width: 24rem">
                <input type="text" class="form-control" placeholder="Hub name" v-model="newHubName" @keyup.enter="createHub" />
                <button class="btn btn-primary" @click="createHub">Create</button>
                <button class="btn btn-outline-primary" @click="addingHub = false">Dismiss</button>
            </div>
        </div>
        <hr>
        <router-view class=""></router-view>
    </div>
</template>


<script>
import { api } from '@/api.js'
import { useAuthStore } from '@/stores/auth.js'

// nicer nav labels for known hubs; everything else gets Title Case
const HUB_LABELS = {
  heimrat: 'Dorm Council',
  'flea-market': 'Flea Market'
}

export default {
  data() {
    return {
      hubs: [],
      addingHub: false,
      newHubName: ''
    }
  },
  computed: {
    isAuthenticated() {
      return useAuthStore().isAuthenticated
    },
    canManageHubs() {
      return useAuthStore().hasRole('hubs')
    }
  },
  created() {
    this.fetchHubs()
  },
  methods: {
    hubLabel(name) {
      return HUB_LABELS[name] || name.charAt(0).toUpperCase() + name.slice(1)
    },
    async fetchHubs() {
      this.hubs = await api.get('blackboard/all')
    },
    async createHub() {
      const name = this.newHubName.trim()
      if (!name) return
      try {
        await api.post('blackboard/secure/hubs', { name }, { auth: true })
      } catch (error) {
        alert(error.message)
        return
      }
      this.addingHub = false
      this.newHubName = ''
      this.fetchHubs()
    }
  },
};
</script>
