module.exports = {
    params: {
        sensitivity: 0.5,
        vibrationReduction: 0
    },
    layout: [
        0x000, 0x000, 0x000, 0x000, 0x000,
        0x000, 0x000, 0x000, 0x000, 0x000,
        0x004, 0x004, 0x000, 0x000, 0x000,
        0x004, 0x004, 0x000, 0x000, 0x000,
        0x003, 0x003, 0x000, 0x000, 0x000,
        0x003, 0x003, 0x000, 0x000, 0x000,
        0x001, 0x001, 0x001, 0x001, 0x001,
        0x001, 0x001, 0x001, 0x001, 0x001,
        0x001, 0x001, 0x001, 0x001, 0x001,
        0x002, 0x002, 0x002, 0x002, 0x002,
        0x002, 0x002, 0x002, 0x002, 0xFFF,
    ],
    button: {
        0x000: {
            text: 'OuO',
            color: 'cornflowerblue',
            input: controller => controller.keyIn(33),
            output: controller => controller.keyOut(33)
        }
    },
    moving(data, controller, params) {
        let x = 0
        let y = 0
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
