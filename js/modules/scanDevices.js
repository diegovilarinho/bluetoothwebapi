const scanDevices = () => {
	navigation.bluetooth.requestDevice({ filters: [{ services: ['battery_service'] }] })
	.then(device => {})
	.catch(error => { console.log(error); });
};

export default scanDevices;