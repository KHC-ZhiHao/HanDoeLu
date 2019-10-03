<template>
    <div id="main">
        <div v-if="configs == null">
            Loading...
        </div>
        <div v-else>
            <select v-model="target">
                <option v-for="config in configs" :key="config">{{ config }}</option>
            </select>
            <textarea v-if="detail" v-model="params"></textarea>
            <button v-if="detail" @click="setConfig()">Select</button>
        </div>
    </div>
</template>

<style>
    #main {
        padding: 1em;
    }
    #main select {
        width: 100%;
        padding: 1em;
        margin-bottom: 1em;
    }
    #main button {
        width: 100%;
        padding: 1em;
    }
    #main textarea {
        width: 100%;
        height: 50vh;
        resize: vertical;
    }
</style>

<script>
    module.exports = {
        data() {
            return {
                target: null,
                params: null,
                configs: null,
                detail: false
            }
        },
        watch: {
            target() {
                let params = {
                    name: this.target
                }
                this.detail = false
                axios
                    .get('./api/getConfigDetail', { params })
                    .then(result => {
                        this.detail = true
                        this.params = JSON.stringify(result.data.params || {}, null, 4)
                    })
            }
        },
        mounted() {
            axios
                .get('./api/getConfigs')   
                .then(result => {
                    this.configs = result.data
                    this.target = this.configs[0]
                })
        },
        methods: {
            setConfig() {
                let params = {
                    name: this.target,
                    params: this.params
                }
                axios
                    .get('./api/setConfig', { params })
                    .then(() => {
                        this.$router.push({
                            name: 'driver'
                        })
                    })
            }
        }
    }
</script>