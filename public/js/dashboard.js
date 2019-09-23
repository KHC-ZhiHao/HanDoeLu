const host = location.host
const driverUrl = location.protocol + '//' + host + '/driver'
const socket = io('http://' + host, { query: 'type=dashboard' })
const dashboard = document.getElementById('dashboard')
const select = document.getElementById('selectConfig')

$('#qrcode').qrcode(driverUrl)

socket.on(`dashboard`, (body) => {
    dashboard.innerHTML = JSON.stringify(body, null, 4)
})

socket.on('config', (config) => {
    document.getElementById('now_mode').innerHTML = config.mode
})

function resetConfig() {
    $.ajax({
        url: `/api/setConfig?name=${select.value}`
    })
}

$.ajax({
    url: `/api/getConfigs`,
    success: function(data){
        let options = ''
        for (let key of data) {
            options += `<option value="${key}">${key}</option>`
        }
        select.innerHTML = options
    }
})