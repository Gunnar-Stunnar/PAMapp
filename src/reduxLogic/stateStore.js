import { configureStore } from '@reduxjs/toolkit';

import { BLE_init, getDevices } from './services/bluetoothService';

import deviceManagerReducer, {addDevice, updateDevice, removeDevice, isRefreshing, discoveredDevice } from './reducers/deviceManagerReducer';

import { bluetoothMiddleWare } from './middleware/bluetoothMiddleWare';
import { stringToBytes, bytesToString } from "convert-string";

// Build store for whole app
export const store = configureStore({
  reducer: {
    deviceManager: deviceManagerReducer
  },
  middleware:[bluetoothMiddleWare]
});



type StoreDispatchType = typeof store.dispatch;

export const initiateBLE = async (dispatchFunc: StoreDispatchType) => {
   const bleManagerEmitter = BLE_init();


    // add perpherial when discovered
    const handleDiscoverPeripheral = (peripheral) => {
                
        if (!peripheral.name) {
            return;
        }

        dispatchFunc(discoveredDevice(peripheral));
    }

    // updates scanner stopped
    const handleScanningStopped = () => {
        console.log("Scanning Stopped");
        dispatchFunc(isRefreshing(false));
        // setIsScanning(false)
    }

    const handleConnectPeripheral = async (peripheralID, status) => {
        console.log(`${peripheralID} Connected`);
    }

    // var message = ""; // TODO: FIX FOR MULTIPLE DEVICES
    const handleUpdateValueForCharacteristic = ({ value, peripheral, characteristic, service }) => {

        dispatchFunc(updateDevice({
            message: bytesToString(value),
            prepherialID: peripheral
        }))

    };

    // scanning for devices
    bleManagerEmitter.addListener('BleManagerStopScan',  handleScanningStopped);
    bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);

    // connecting peripheral
    bleManagerEmitter.addListener('BleManagerConnectPeripheral',  handleConnectPeripheral);
    bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic',  handleUpdateValueForCharacteristic);
};