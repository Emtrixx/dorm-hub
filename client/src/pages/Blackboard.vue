<template>
    <div>
        <div>
            <h3>TOP Hubs</h3>
            <!-- TODO if user is logged in:  -->
            <!-- <div>
                <router-link to="/blackboard/heimrat/index">Edit My Hubs</router-link>
            </div> -->
            <div class="btn-group my-3">
                <router-link class="btn btn-primary" to="/blackboard/all">All</router-link>
                <router-link class="btn btn-primary" to="/blackboard/general/index">General</router-link>
                <router-link class="btn btn-primary" to="/blackboard/foodsharing/index">Foodsharing</router-link>
                <router-link class="btn btn-primary" to="/blackboard/heimrat/index">Heimrat</router-link>
            </div>
        </div>
        <hr>
        <router-view class=""></router-view>
    </div>
</template>

