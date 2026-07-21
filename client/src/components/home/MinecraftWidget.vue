<template>
<section>
  <h2 class="dh-section-title">Minecraft server</h2>
  <base-card>
    <div class="d-flex align-items-center gap-2 mb-2">
      <span class="status-dot" :class="online ? 'status-online' : 'status-offline'"></span>
      <code class="server-address">dorm-hub.de</code>
    </div>
    <p v-if="loading" class="server-meta">Checking status…</p>
    <p v-else-if="!online" class="server-meta">Offline right now.</p>
    <p v-else class="server-meta">
      {{ data.players.online }}/{{ data.players.max }} players online · {{ data.version.name }}
    </p>
  </base-card>
</section>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      online: false,
      data: {},
      interval_id: undefined
    };
  },
  created() {
      this.someMethod();
  },
  methods: {
    async someMethod() {
            this.fetchData();
            // Execute fetchData every 10 seconds
            this.interval_id = setInterval(() => {
                this.fetchData();
            }, 10000);
    },
    async fetchData() {
      try {
        const res = await fetch("https://api.minetools.eu/ping/dorm-hub.de/25565");
        const resData = await res.json();
        if (!res.ok || resData.error) {
          throw new Error(resData.message || resData.error || "Failed to reach the server!");
        }
        this.data = resData
        this.online = true
      } catch (error) {
        console.log(error.message);
        this.online = false
      }
      this.loading = false
    },
  },
  unmounted() {
    if(this.interval_id) {
      clearInterval(this.interval_id);
    }
  }
};
</script>


<style scoped>
.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
}

.status-online {
  background: var(--dh-moss);
  box-shadow: 0 0 0 3px rgba(76, 130, 89, 0.2);
}

.status-offline {
  background: var(--dh-mist);
  box-shadow: 0 0 0 3px rgba(102, 115, 126, 0.15);
}

.server-address {
  color: var(--dh-ink);
  font-weight: 600;
}

.server-meta {
  color: var(--dh-mist);
  margin-bottom: 0;
  font-size: 0.9rem;
}
</style>
