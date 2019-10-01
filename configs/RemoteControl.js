module.exports = {
    mode: 'LaserPen',
    custom: {
        sensitivity: 0.5,
        vibrationReduction: 0
    },
    layout: [
        0x000, 0x000, 0x000, 0x000, 0x000,
        0x000, 0x000, 0x000, 0x000, 0x000,
        0x004, 0x004, 0x000, 0x000, 0x000,
        0x004, 0x004, 0x000, 0x000, 0x000,
        0x003, 0x003, 0x000, 0x000, 0x000,
        0x003, 0x003, 0x000, 0x000, 0xFFF,
        0x001, 0x001, 0x001, 0x001, 0x001,
        0x001, 0x001, 0x001, 0x001, 0x001,
        0x001, 0x001, 0x001, 0x001, 0x001,
        0x002, 0x002, 0x002, 0x002, 0x002,
        0x002, 0x002, 0x002, 0x002, 0x002,
    ],
    button: {
        0x000: {
            name: 'blue',
            code: 'Keyboard',
            style: 'background-color:cornflowerblue',
            content: 'Q',
            inputValue: 33
        },
        0x001: {
            name: 'red',
            code: 'MouseLeft',
            style: 'background-color:red'
        },
        0x002: {
            name: 'purple',
            code: 'MouseReset',
            style: 'background-color:purple'
        },
        0x003: {
            name: 'yellow',
            code: 'MouseWheel',
            value: -300,
            style: 'background-color:yellow'
        },
        0x004: {
            name: 'gray',
            code: 'MouseWheel',
            value: 300,
            style: 'background-color:gray'
        }
    },
    update(data, action, controller) {
        let x = 0
        let y = 0
        let rAlpha = Math.abs(data.rotationRateAlpha) > action.custom.vibrationReduction ? data.rotationRateAlpha : 0
        let rGamma = Math.abs(data.rotationRateGamma) > action.custom.vibrationReduction ? data.rotationRateGamma : 0
        if (Math.abs(data.gamma) > 45) {
            x = rAlpha * action.custom.sensitivity
            y = rGamma * -1 * action.custom.sensitivity
        } else {
            x = rGamma * -1 * action.custom.sensitivity
            y = rAlpha * -1 * action.custom.sensitivity
        }
        controller.mouseMove(x, y)
    }
}
