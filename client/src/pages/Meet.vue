<template>
  <div class="contain">
    <header class="dh-page-head">
      <span class="dh-eyebrow">Video calls for the house</span>
      <h1>Meet</h1>
    </header>
    <div class="d-flex flex-wrap align-items-center gap-2 my-3">
      <div class="dh-pills">
        <button class="btn" :class="channel==='test' ? 'active' : ''" @click="switchChannel('test')">Test</button>
        <button class="btn" :class="channel==='all' ? 'active' : ''" @click="switchChannel('all')">All</button>
        <button class="btn" :class="channel==='heimrat' ? 'active' : ''" @click="switchChannel('heimrat')">Heimrat</button>
      </div>
      <a href="https://meet.dorm-hub.de/" class="btn btn-outline-primary btn-sm ms-auto" target="_blank" rel="noopener">Open in new tab <i class="bi bi-box-arrow-up-right"></i></a>
    </div>
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
  height: 80vh;
  width: 100%;
  border-radius: var(--dh-radius);
  overflow: hidden;
  border: 1px solid var(--dh-line);
  background: var(--dh-card);
}
</style>