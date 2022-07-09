<template>
    <div>
        <div>
            <!-- TODO if user is logged in:  -->
            <div class="btn-group my-3 flex-wrap">
                <router-link class="btn btn-primary" to="/blackboard/all">All</router-link>
                <router-link class="btn btn-primary" to="/blackboard/general/index">General</router-link>
                <router-link class="btn btn-primary" to="/blackboard/foodsharing/index">Foodsharing</router-link>
                <router-link class="btn btn-primary" to="/blackboard/heimrat/index">Dorm Council</router-link>
                <router-link class="btn btn-primary" to="/blackboard/flea-market/index">Flea Market</router-link>
                <router-link v-if="isAuthenticated" class="btn btn-dark" to="/blackboard/my-hubs">My Hubs</router-link>
            </div>
        </div>
        <hr>
        <router-view class=""></router-view>
    </div>
</template>


<script>

export default {
  computed: {
    isAuthenticated() {
      return this.$store.getters['isAuthenticated']
    }
  },
};
</script>
