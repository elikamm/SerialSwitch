const FS = require("fs");

module.exports = (api) => {
    api.registerAccessory("SerialSwitch", SerialSwitchPlugin);
}

class SerialSwitchPlugin {
    constructor(_, config, api) {
        this.stream = FS.createWriteStream(config.port);

        this.ON = false;
        this.send();

        this.informationService = new api.hap.Service.AccessoryInformation()
            .setCharacteristic(api.hap.Characteristic.Manufacturer, "Elias Kamm")
            .setCharacteristic(api.hap.Characteristic.SerialNumber, "xxxxx")
            .setCharacteristic(api.hap.Characteristic.Model, "SerialSwitch")

        this.switchService = new api.hap.Service.Switch(this.name)

        this.switchService.getCharacteristic(api.hap.Characteristic.On)
            .onGet(this.getOnHandler.bind(this))
            .onSet(this.setOnHandler.bind(this))
    }

    getServices() {
        return [
            this.informationService,
            this.switchService
        ];
    }

    async getOnHandler() {
        return this.ON;
    }

    async setOnHandler(value) {
        this.ON = value;
        this.send();
    }

    send() {
        this.stream.write(this.ON ? "1" : "0");
    }
}