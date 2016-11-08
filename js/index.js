class GenericDevice {

  constructor() {
    this.device = null;
    this.onDisconnected = this.onDisconnected.bind(this);
  }

  request() {
    let options = {
      "filters": [{
        "name": "foo"
      }],
      "optionalServices": ["device_information"]
    };
    return navigator.bluetooth.requestDevice(options)
    .then(device => {
      this.device = device;
      this.device.addEventListener('gattserverdisconnected', this.onDisconnected);
      return device;
    });
  }

  connect() {
    if (!this.device) {
      return Promise.reject('Device is not connected.');
    } else {
      return this.device.gatt.connect();
    }
  }
  
  readManufacturername() {
    return this.device.gatt.getPrimaryService("device_information")
    .then(service => service.getCharacteristic("manufacturer_name_string"))
    .then(characteristic => characteristic.readValue());
  }

  disconnect() {
    if (!this.device) {
      return Promise.reject('Device is not connected.');
    } else {
      return this.device.gatt.disconnect();
    }
  }

  onDisconnected() {
    console.log('Device is disconnected.');
  }
}

function onButtonClick() {
  log('Requesting Bluetooth Device...');
  navigator.bluetooth.requestDevice(
    {filters: [{services: ['battery_service']}]})
  .then(device => {
    log('Connecting to GATT Server...');
    return device.gatt.connect();
  })
  .then(server => {
    log('Getting Battery Service...');
    return server.getPrimaryService('battery_service');
  })
  .then(service => {
    log('Getting Battery Level Characteristic...');
    return service.getCharacteristic('battery_level');
  })
  .then(characteristic => {
    log('Reading Battery Level...');
    return characteristic.readValue();
  })
  .then(value => {
    let batteryLevel = value.getUint8(0);
    log('> Battery Level is ' + batteryLevel + '%');
  })
  .catch(error => {
    log('Argh! ' + error);
  });
}

var genericDevice = new GenericDevice();

document.querySelector('button').addEventListener('click', function() {
  onButtonClick();
});