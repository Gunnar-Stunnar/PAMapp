import React, { Component } from 'react';
import {NativeModules, NativeEventEmitter, Platform, PermissionsAndroid} from 'react-native';
import BleManager from 'react-native-ble-manager';
import { stringToBytes, bytesToString } from "convert-string";
import type { Device } from '../models/device.js';


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
        this.message = ""

        //start Bluetooth
        if (Platform.OS === 'android' && Platform.Version >= 23) {
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
                if (result) {
                  console.log("Permission is OK");
                } else {
                  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
                    if (result) {
                      console.log("User accept");
                    } else {
                      console.log("User refuse");
                    }
                  });
                }
            });
        }
        BleManager.start({showAlert: false});
        BleManager.checkState();
    }
    
    async getDevices(){
        return BleManager.getConnectedPeripherals([]);
    }
    async disconnectDevice(peripheral){
        return BleManager.disconnect(peripheral);
    }

    async listenForDevice(seconds) {
        return BleManager.scan([UART_SERVICE_UUID], seconds, false);
    }

    

    async connectDevice(peripheral){

        const awaitTimeout = delay => new Promise(resolve => setTimeout(resolve, delay));
        console.log(peripheral);

        await BleManager.connect(peripheral.id).catch((e)=>console.log(e));
        console.log("Connected");

        await awaitTimeout(900);

        const peripheralData = await BleManager.retrieveServices(peripheral.id, [UART_SERVICE_UUID]).catch((e) => console.log(e));
        console.log(peripheralData.name);

        console.log("0")
        if (Platform.OS === 'android'){
            await BleManager.requestMTU(peripheral.id, 512).catch((e) => console.log(e));
        }
        
        console.log("1")
        await BleManager.startNotification(peripheral.id, UART_SERVICE_UUID, UART_TX_CHAR_UUID).catch((e) => console.log(e));
        console.log("2")
           
    }

    // interacting per device
    async writeToPam(peripheral, data){
        return BleManager.retrieveServices(peripheral).then(async (peripheralInfo) => {
            console.log("Sending: " + data)
            const dataBytes = stringToBytes(data)
            await BleManager.write(
                peripheral,
                UART_SERVICE_UUID,
                UART_RX_CHAR_UUID,
                dataBytes,
                512
            )
        });
    }
}


