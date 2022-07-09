<template>
<base-card class="row justify-content-center">
  <div class="col-md-8 text-center">
    <h3>Minecraft Server Status</h3>
    <div class="header">
      <div class="image">
        <img class="img-fluid"  src="https://images-eu.ssl-images-amazon.com/images/I/418cEZfh8-L.jpg" alt="minecraft image" />
      </div>
      <h2>dorm-hub.de</h2>
    </div>
    <div v-if="loading">
        <p>Loading ...</p>
    </div>
    <div v-else>
        <p>
            Players Online: {{data.players.online}}/{{data.players.max}}
        </p>
        <p>
            Version: {{data.version.name}}
        </p>
    </div>
  </div>
</base-card>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
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
      var url = "https://api.minetools.eu/ping/dorm-hub.de/25565";
      const res = await fetch(url);
      const resData = await res.json();

      if (!res.ok) {
        const error = new Error(resData.message || "Failed to fetch post!");
        console.log(error.message);
        throw error;
      }
      console.log('fetching minecraft data')
      this.data = resData
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
img {
    height: 200px;
}
</style>