import React from 'react';
import {NativeModules, NativeEventEmitter} from 'react-native';
import BleManager from 'react-native-ble-manager';


// Constant for communicating to devices
const UART_SERVICE_UUID = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E"
const UART_RX_CHAR_UUID = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E"
const UART_TX_CHAR_UUID = "6E400003-B5A3-F393-E0A9-E50E24DCCA9E"

const DEVICE_ID = "E8:9F:6D:B3:28:06";

// // bluetooth adapter for communicating with PAM 
// export class BluetoothAdapter {
    
//     constructor(){}

//     connect() {}
//     disconnect() {}
//     write() {}
//     getBLEObj() {}

// }

// module pass down widget tree for app use
export class BluetoothModule {

    constructor(){
        const BleManagerModule = NativeModules.BleManager;
        const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
        this.bleManagerEmitter = bleManagerEmitter;
        this.bleManager = BleManager;

        //start Bluetooth
        BleManager.start({showAlert: false});
    }
    
    async getDevice(){
        return BleManager.getConnectedPeripherals([]);
    }
    async disconnectDevice(peripheral){
        return BleManager.disconnect(peripheral.id);
    }
    async listenForDevice(seconds) {
        return BleManager.scan([], seconds, true); 
    }
    async connectDevice(peripheral){
        return BleManager.connect(peripheral.id);
    }

    // interacting per device
    async writeToPam(peripheral, data){
        return BleManager.write(
            peripheral.id,
            UART_SERVICE_UUID,
            UART_RX_CHAR_UUID,
            data
          )
    }
}


