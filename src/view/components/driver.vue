<template>
    <div id="driver">
        <div v-if="config == null">
            Loading...
        </div>
        <div v-else class="unit" v-for="layout in config.layout" :key="layout + random()">
            <div
                class="button"
                v-if="config.button[layout]"
                @touchstart="down(layout)"
                @touchend="up(layout)"
                :style="`background-color:${config.button[layout].color || 'transparent'}`">
                <span v-if="config.button[layout]">
                    {{ config.button[layout].text || '' }}
                </span>
            </div>
            <div class="button" v-else></div>
        </div>
    </div>
</template>

<style>
    #driver {
        width: 100%;
        height: 100%;
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        background-image: url('../img/background.jpg');
        -moz-user-select: none;
        -webkit-user-select: none;
    }

    #driver .unit {
        width: 20%;
        height: 9.09%;
        display: flex;
        padding: 2px;
        transition: 0.2s;
        animation-name: show;
        animation-duration: 1s;
    }

    #driver .unit .button {
        width: 100%;
        height: 100%;
        opacity: 0.8;
        box-shadow: 0px 0px 5px #000;
        transition: 0.05s;
        color: #FFF;
        padding: 5px;
        padding-top: 20%;
        text-align: center;
        background-color: transparent;
    }

    #driver .unit .active {
        transform: scale(0.9);
    }

    @keyframes show{
        from {
            transform: scale(0);
        }
        to {
            transform: scale(1);
        }
    }
</style>

<script>
    module.exports = {
        data() {
            return {
                press: [],
                config: null,
                socket: io('http://' + location.host),
                axis: {
                    alpha: 0,
                    beta: 0,
                    gamma: 0,
                    rotationRateAlpha: 0,
                    rotationRateBeta: 0,
                    rotationRateGamma: 0,
                    accelerationX: 0,
                    accelerationY: 0,
                    accelerationZ: 0
                }
            }
        },
        mounted () {
            axios
                .get('./api/getConfig')
                .then(result => {
                    if (!result.data) {
                        return this.$router.push({
                            name: 'main'
                        })
                    }
                    this.config = result.data
                    this.init()
                })
        },
        methods: {
            init() {
                if (window.DeviceOrientationEvent) {
                    this.devicemotion = event => {
                        this.axis.accelerationX = Math.round(event.acceleration.x)
                        this.axis.accelerationY = Math.round(event.acceleration.y)
                        this.axis.accelerationZ = Math.round(event.acceleration.z)
                        this.axis.rotationRateAlpha = Math.round(event.rotationRate.alpha)
                        this.axis.rotationRateBeta = Math.round(event.rotationRate.beta)
                        this.axis.rotationRateGamma = Math.round(event.rotationRate.gamma)
                    }
                    this.deviceorientation = event => {
                        this.axis.alpha = event.alpha
                        this.axis.beta = event.beta
                        this.axis.gamma = event.gamma
                    }
                    window.addEventListener('deviceorientation', this.deviceorientation, false)
                    window.addEventListener("devicemotion", this.devicemotion, false)
                    this.interval = setInterval(() => {
                        this.socket.emit('driver-update', this.axis)
                    }, 1)
                } else {
                    alert('This browser not support 6 orientation.') 
                }
            },
            down(index) {
                console.log('d')
                this.socket.emit('driver-down', index)
            },
            up(index) {
                console.log('u')
                this.socket.emit('driver-up', index)
            },
            random() {
                return Math.random()
            }
        },
        destroyed() {
            this.socket.close()
            if (this.devicemotion) {
                window.clearInterval(this.interval)
                window.removeEventListener(this.devicemotion)
                window.removeEventListener(this.deviceorientation)
            }
        }
    }
</script>
