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

// const parseBody = (item, deviceList, index) => {
//     if (item["type"] == "setting") {
//         console.log(item["content"]["description"])
//         if (item["content"]["type"] == "menu") {
//             for (var i = 0; i < item["content"]["items"].length; i++) {
//                 parseBody(item["content"]["items"][i])
//             }
//         }
//         else {
//             console.log("    Current Value: " + item["content"]["currentVal"])
//         }
//     }
//     else if (item["type"] == "measurement") {
//         var there = false;
//         if (deviceList[index].Species.item["content"]["name"] != null) {
//             var lastNum = deviceList[index].item["content"]["name"].packets[deviceList[index].item["content"]["name"].packetslength-1].packetNum
//             deviceList[index].Species.item["content"]["name"].packets.push({
//                 units: item["content"]["units"],
//                 value: item["content"]["value"],
//                 packetNum: lastNum + 1,
//                 dateTime: Date().now()
//             })
//         }
//         console.log(item["content"]["name"] + ": " + item["content"]["value"] + " " + item["content"]["units"])
//     }
//     else if (item["type"] == "confirmation") {
//         console.log("Changed " + item["content"]["id"] + " to " + item["content"]["newValue"])
//     }
// }

// module pass down widget tree for app use
export class BluetoothModule {
    
    constructor(){
        const BleManagerModule = NativeModules.BleManager;
        const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
        this.bleManagerEmitter = bleManagerEmitter;
        this.bleManager = BleManager;
        this.message = ""

        //start Bluetooth
        BleManager.start({showAlert: false});
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
    }
    
    async getDevices(){
        return BleManager.getConnectedPeripherals([]);
    }
    async disconnectDevice(peripheral){
        BleManager.disconnect(peripheral);
    }
    async listenForDevice(seconds) {
        return BleManager.scan([UART_SERVICE_UUID], seconds, true);
    }
    async connectDevice(peripheral){
        await BleManager.connect(peripheral);
        await BleManager.retrieveServices(peripheral);
        await BleManager.requestMTU(peripheral, 512);
        BleManager.startNotification(peripheral, UART_SERVICE_UUID, UART_TX_CHAR_UUID);
    }

    // interacting per device
    async writeToPam(peripheral, data){
        return BleManager.retrieveServices(peripheral).then((peripheralInfo) => {
            console.log("Sending: " + data)
            const dataBytes = stringToBytes(data)
            BleManager.write(
                peripheral,
                UART_SERVICE_UUID,
                UART_RX_CHAR_UUID,
                dataBytes,
                512
            )
        });
    }
}


