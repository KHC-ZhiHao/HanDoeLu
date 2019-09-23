class Button {

    constructor(core, config) {
        this.name = config.name
        this.core = core
        this.code = config.code
        this.value = config.value
        this.status = false
    }

    action(status) {
        if (this.status !== status) {
            let event = this.core.buttonEvents[this.code]
            if (event) {
                if (this.status === false) {
                    event[0](this.value, this.core, this.core.controller)
                } else {
                    event[1](this.value, this.core, this.core.controller)
                }
            }
            this.status = status
        }
    }

}

module.exports = class {

    constructor(controller) {
        this.mode = null
        this.screen = {}
        this.config = null
        this.controller = controller
        this.buttonEvents = {}
        this.init()
        this.setScreen(0, 0)
    }

    init() {
        this.custom = {}
        this.buttons = []
        this.modeUpdate = null
        this.attributes = {}
    }

    setScreen(width, height) {
        this.screen.width = width
        this.screen.height = height
    }

    addButtonEvent(name, actions) {
        this.buttonEvents[name] = [
            actions[0] || function() {},
            actions[1] || function() {}
        ]
    }

    update(data) {
        for (let button of this.buttons) {
            button.action(data.buttons[button.name])
        }
        if (this.modeUpdate) {
            this.modeUpdate(data, this, this.controller)
        }
    }

    setConfig(config) {
        this.init()
        this.config = config
        this.mode = config.mode
        this.custom = config.custom
        this.modeUpdate = config.update
        if (config.button) {
            for (let index in config.button) {
                this.buttons.push(new Button(this, config.button[index]))
            }
        }
    }

    getConfig() {
        return this.config
    }

}