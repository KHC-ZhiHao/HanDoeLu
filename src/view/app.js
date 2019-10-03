import router from './router.js'
import loader from './lib/vue-http-loader/index.js'

loader.addComponentFileFor('./components/', {
    'app-main': 'main.vue',
    'app-driver': 'driver.vue'
})

loader.onload((components) => {
    for (var key in components) {
        Vue.component(key, components[key])
    }
    new Vue({
        router: router(components),
        el: '#app'
    })
})
