// https://www.itread01.com/content/1545905367.html 鍵盤對照表

const os = require('os')
const type = os.type()

module.exports = {
    params: {
        sensitivity: 0.5,
        vibrationReduction: 0
    },
    layout: [
        0x000, 0x000, 0x000, 0x000, 0x000,
        0x000, 0x000, 0x000, 0x000, 0x000,
        0x000, 0x000, 0x000, 0x000, 0x000,
        0x000, 0x000, 0x000, 0x000, 0x000,
        0x000, 0x000, 0x000, 0x000, 0x000,
        0x000, 0x000, 0x000, 0x000, 0x000,
        0x000, 0x000, 0x000, 0x000, 0x000,
        0x000, 0x000, 0x000, 0x000, 0x000,
        0x000, 0x000, 0x000, 0x000, 0x000,
        0x000, 0x000, 0x000, 0x000, 0x000,
        0x000, 0x000, 0x000, 0x000, 0x00F,
    ],
    button: {
        0x000: {
            text: 'm-left',
            color: 'cornflowerblue',
            input: controller => controller.keyDown(48),
            output: controller => controller.keyUp(48)
        },
        0x00F: {
            text: 'reset',
            color: 'cornflowerblue',
            input: controller => {
                let centerX = controller.width / 2
                let centerY = controller.height / 2
                controller.mouseTo(centerX, centerY)
            }
        }
    },
    update(data, controller) {
        let x = 0
        let y = 0
        let params = controller.params
        let rAlpha = Math.abs(data.rotationRateAlpha) > params.vibrationReduction ? data.rotationRateAlpha : 0
        let rGamma = Math.abs(data.rotationRateGamma) > params.vibrationReduction ? data.rotationRateGamma : 0
        if (Math.abs(data.gamma) > 45) {
            x = rAlpha * params.sensitivity
            y = rGamma * -1 * params.sensitivity
        } else {
            x = rGamma * -1 * params.sensitivity
            y = rAlpha * -1 * params.sensitivity
        }
        controller.mouseMove(x, y)
    }
}
