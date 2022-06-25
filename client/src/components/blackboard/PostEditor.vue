<template>
    <div>
        <!-- Button trigger modal -->
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
            Edit Post
        </button>
        <button type="button" class="btn btn-danger" @click="deletePost">
            Delete Post
        </button>

        <!-- Modal -->
        <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
            aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Edit post</h5>
                        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form>
                            <p>Title</p>
                            <input class="form-control" type="text" v-model="title">
                            <p>Text</p>
                            <textarea type="text" class="form-control" v-model="text"></textarea>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="sendPost">Save
                            changes</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ["current_post", "hubId"],
    data() {
        return {
            title: this.current_post.title,
            text: this.current_post.text,
            post: this.current_post,
        };
    },
    methods: {
        async sendPost() {
            this.post.title = this.title;
            this.post.text = this.text;
            let url = process.env.VUE_APP_HOST || "http://localhost:8081/";
            await fetch(url + 'blackboard-secure/setPost', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + localStorage.getItem('token')
                },
                method: 'POST',
                body: JSON.stringify(this.post)
            })
        },
        async deletePost() {
            let url = process.env.VUE_APP_HOST || "http://localhost:8081/";
            await fetch(url + 'blackboard-secure/'+this.hubId + "/" + this.post._id, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + localStorage.getItem('token')
                },
                method: 'DELETE',
                body: JSON.stringify(this.post)
            })
            this.$router.push("/blackboard/"+this.hubId + "/index");
        }
    },
};
</script>
