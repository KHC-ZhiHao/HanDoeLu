<template>
    <div id="main">
        <div v-if="configs == null">
            Loading...
        </div>
        <div v-else>
            <select v-model="target">
                <option v-for="config in configs" :key="config">{{ config }}</option>
            </select>
            <button @click="setConfig()">Select</button>
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
</style>

<script>
    module.exports = {
        data() {
            return {
                target: null,
                configs: null
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
                    name: this.target
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