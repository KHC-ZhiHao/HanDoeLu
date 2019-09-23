const host = location.host
const socket = io('http://' + host, { query:'type=driver' })
const control = {
    alpha: 0,
    beta: 0,
    gamma: 0,
    enable: false,
    buttons: {},
    rotationRateAlpha: 0,
    rotationRateBeta: 0,
    rotationRateGamma: 0,
    accelerationX: 0,
    accelerationY: 0,
    accelerationZ: 0
}

function initButton(config) {
    control.buttons = {}
    let main = document.getElementById('main')
        main.innerHTML = ''
    for (let number of config.layout) {
        if (number === 4095) {
            createPower()
            continue
        }
        let btn = config.button[number]
        let name = btn.name
        let unit = document.createElement('div')
        unit.className = 'unit'
        unit.addEventListener('touchstart', () => {
            control.buttons[name] = true
            $(`.name-${name}`).addClass('press')
        })
        unit.addEventListener('touchend', () => {
            control.buttons[name] = false
            $(`.name-${name}`).removeClass('press')
        })
        unit.innerHTML = `<div class="button name-${name}" style="${btn.style}">${btn.content || ''}</div>`
        control.buttons[name] = false
        main.appendChild(unit)
    }
}

function createPower() {
    let unit = document.createElement('div')
    unit.className = control.enable ? 'unit power' : 'unit power unpower'
    unit.innerHTML = '<div class="button"></div>'
    unit.addEventListener('touchstart', () => {
        control.enable = !control.enable
        unit.className = control.enable ? 'unit power' : 'unit power unpower'
    })
    document.getElementById('main').appendChild(unit)
}

socket.on('config', (config) => {
    initButton(config)
})

if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', function (event) {
        control.alpha = event.alpha
        control.beta = event.beta
        control.gamma = event.gamma
    }, false)
    window.addEventListener("devicemotion", function(event) {
        control.accelerationX = Math.round(event.acceleration.x)
        control.accelerationY = Math.round(event.acceleration.y)
        control.accelerationZ = Math.round(event.acceleration.z)
        control.rotationRateAlpha = Math.round(event.rotationRate.alpha)
        control.rotationRateBeta = Math.round(event.rotationRate.beta)
        control.rotationRateGamma = Math.round(event.rotationRate.gamma)
    }, false);
} else {
    alert('這是不支援的瀏覽器') 
}

setInterval(() => {
    socket.emit('control', control)
}, 1)