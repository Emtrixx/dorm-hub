<template>
    <div>
        <header class="dh-page-head">
            <span class="dh-eyebrow">The pinboard</span>
            <h1>Blackboard</h1>
        </header>
        <div>
            <div class="dh-pills my-3">
                <router-link class="btn" to="/blackboard/all">All</router-link>
                <router-link
                    v-for="hub in hubs"
                    :key="hub._id"
                    class="btn"
                    :to="'/blackboard/' + hub.name + '/index'"
                >{{ hubLabel(hub.name) }}</router-link>
                <router-link v-if="isAuthenticated" class="btn" to="/blackboard/my-hubs">My Hubs</router-link>
                <button v-if="canManageHubs && !addingHub" class="btn" @click="addingHub = true">
                    <i class="bi bi-plus-lg"></i> Add hub
                </button>
                <button v-if="canManageHubs" class="btn" @click="managingHubs = !managingHubs">
                    <i class="bi bi-gear"></i> {{ managingHubs ? 'Done' : 'Manage' }}
                </button>
            </div>
            <div v-if="addingHub" class="input-group my-2" style="max-width: 24rem">
                <input type="text" class="form-control" placeholder="Hub name" v-model="newHubName" @keyup.enter="createHub" />
                <button class="btn btn-primary" @click="createHub">Create</button>
                <button class="btn btn-outline-primary" @click="addingHub = false">Dismiss</button>
            </div>
            <div v-if="managingHubs" class="my-2">
                <div v-for="hub in hubs" :key="hub._id" class="d-flex align-items-center gap-2 mb-1">
                    <button class="btn btn-sm btn-outline-danger" @click="deleteHub(hub)">
                        <i class="bi bi-trash"></i>
                    </button>
                    <span>{{ hubLabel(hub.name) }} ({{ hub.posts.length }} posts)</span>
                </div>
            </div>
        </div>
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
      managingHubs: false,
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
    },
    async deleteHub(hub) {
      if (!confirm(`Delete hub "${this.hubLabel(hub.name)}" and all its posts?`)) return
      try {
        await api.delete('blackboard/secure/hubs/' + hub.name, undefined, { auth: true })
      } catch (error) {
        alert(error.message)
        return
      }
      if (this.$route.path.startsWith('/blackboard/' + hub.name)) {
        this.$router.push('/blackboard/all')
      }
      this.fetchHubs()
    }
  },
};
</script>
