<template>
<div>
    <div>
        <h3>TOP Hubs</h3>
        <div class="btn-group my-3">
            <router-link class="btn btn-primary" to="/blackboard/all">All</router-link>
            <router-link class="btn btn-primary" to="/blackboard/general/index">General</router-link>
            <router-link class="btn btn-primary" to="/blackboard/foodsharing/index">Foodsharing</router-link>
            <router-link class="btn btn-primary" to="/blackboard/heimrat/index">Heimrat</router-link>
        </div>
    </div>
    <hr>
    <router-view></router-view>
</div>
</template>

