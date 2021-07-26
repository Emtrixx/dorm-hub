<template>
  <div class="contain">
    <div class="btn-group my-3">
      <button class="btn btn-primary" :class="channel==='test' ? 'active' : ''" @click="switchChannel('test')">Test</button>
      <button class="btn btn-primary" :class="channel==='all' ? 'active' : ''" @click="switchChannel('all')">All</button>
      <button class="btn btn-primary" :class="channel==='heimrat' ? 'active' : ''" @click="switchChannel('heimrat')">Heimrat</button>
    </div>
    <a href="https://meet.dorm-hub.de/" class="btn btn-info" target="#">Open in new tab</a>
    <div class="player">
      <iframe
        allow="camera; microphone; fullscreen; display-capture; autoplay"
        :src="getLink"
        style="height: 100%; width: 100%; border: 0px"
      ></iframe>
    </div>
  </div>
</template>

<script>
export default {
    data() {
        return {
            channel: '',
        }
    },
    computed: {
        getLink() {
            return 'https://meet.dorm-hub.de/' + this.channel
        }
    },
    methods: {
        switchChannel(channel = '') {
            this.channel = channel
        }
    }
}
</script>

<style>
.player {
  height: 85vh;
  width: 100%;
}
</style>