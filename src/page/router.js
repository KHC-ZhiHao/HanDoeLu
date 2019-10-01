export default function(components) {
    return new VueRouter({
        mode: 'history',
        base: '/',
        routes: [
            {
                path: '*',
                redirect: '/'
            },
            {
                path: '/',
                name: 'main',
                component: components['app-main']
            },
            {
                path: '/driver',
                name: 'driver',
                component: components['app-driver']
            },
            {
                path: '/setting',
                name: 'setting',
                component: components['app-setting']
            }
        ]
    })
}
