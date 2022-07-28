import { useState, useEffect, useContext, useReducer } from 'react';
import { getGlobalContext } from '../services/AppContext';
import type { Device } from '../models/device.js';
import type { SpeciesObj, SpeciesType, ContentType } from '../models/speciesTypes.js';
import type { PacketType } from '../models/packetType.js';
import { stringToBytes, bytesToString } from "convert-string";

// start scanning for devices.
export function useScanning() {

    const peripherals = new Map();

    // setup variables and callbacks
    const [devices, setDevicesList] = useState([]);
    const [isScanning, setIsScanning] = useState(false);

    const GContext = useContext(getGlobalContext())

    
    // functions to manage state changes
    const reload = () => {GContext.Bluetooth.listenForDevice(3).then((results)=>{
        setIsScanning(true);
    });}

    const handleDiscoverPeripheral = (peripheral) => {
        
       
        if (!peripheral.name) {
            return;
        }

        peripherals.set(peripheral.id, peripheral);
        setDevicesList(Array.from(peripherals.values()));
    }

    const handleScanningStopped = () => {
        console.log("Scanning Stopped");
        setIsScanning(false)
    }

    useEffect(() => {

        // add listener and begin Scanning
        GContext.Bluetooth.bleManagerEmitter.addListener('BleManagerStopScan',  handleScanningStopped);
        GContext.Bluetooth.bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
        reload();
        
        return () => {
          // remove listeners
          GContext.Bluetooth.bleManagerEmitter.removeListener('BleManagerStopScan', handleScanningStopped);
          GContext.Bluetooth.bleManagerEmitter.removeListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
        };
      }, []);

      return [devices, isScanning, reload];
}

export function useConnectedDevices() {
    const [connectedDevices, setConnectedDevices] = useState([]);

    const GContext = useContext(getGlobalContext());

    GContext.Bluetooth.getDevices().then((peripheralsArray) => {
        setConnectedDevices(peripheralsArray)
    })

    return connectedDevices;
}

export function useDeviceManager() {
    const GContext = useContext(getGlobalContext())
    // devices stored in map, mapping id (bluetooth peripheral) to device state management
    function reducer(state, action) {
        switch (action.type) {
            case 'add':
                state[action.payload.peripheral] = (action.payload.newDevice)
                return state;

            case 'update':
                state[action.payload.peripheral] = action.payload.updatedDevice
                return state;
        
            default:
                throw new Error();
        }
    }

    const [devices: {[key:String]: [Device, (Device) => void]}, updateDevices] = useReducer(reducer, {});
    
    const parseBody = (item, updatedDevice, latitude, longitude) => {
        if (item["type"] == "setting") {
            console.log(item["content"]["description"])
            if (item["content"]["type"] == "menu") {
                for (var i = 0; i < item["content"]["items"].length; i++) {
                    parseBody(item["content"]["items"][i])
                }
            }
            else {
                console.log("    Current Value: " + item["content"]["currentVal"])
            }
            if (item["content"]["id"] == "deviceId") {
                updatedDevice.ID = Number(item["content"]["currentVal"])
            }
        }
    }

    const parseMessage = (message, updatedDevice) => {
        if (message["type"] == "measurements") {
            updatedDevice["batteryLevel"] = message["battery"];
            for (var i = 0; i < message["body"].length; i++) {
                let packetNum = 0
                let item = message["body"][i]
                if (updatedDevice.Species[item["name"]] == null) {
                    // TODO: check if any of the species info needs updating?
                    updatedDevice.Species[item["name"]] = {species: {name: item["name"], units: item["units"]}, packets: []};
                    console.log("test")
                }
                else {
                    packetNum = updatedDevice.Species[item["name"]].packets.length;
                }
                if (item["value"] !== "N/A") {
                    updatedDevice.Species[item["name"]].packets.push({
                        units: item["units"],
                        value: Number(item["value"]),
                        packetNum: packetNum,
                        dateTime: new Date(),
                        location: {
                            latitude: message["location"]["latitude"],
                            longitude: message["location"]["longitude"]
                        }
                    })
                }
                console.log(updatedDevice.Species[item["name"]].packets)
            }
        }
    }
    
    var message = "";
    const handleUpdateValueForCharacteristic = ({ value, peripheral, characteristic, service }) => {
        message += bytesToString(value)
        if (message.substring(message.length - 3, message.length) == "end") {
            const updatedDevice: Device = devices[peripheral]
            console.log(message.substring(0, message.length - 3))
            let message_json = JSON.parse(message.substring(0, message.length - 3))
            parseMessage(message_json, updatedDevice)
            message = ""
            console.log(updatedDevice)
            updateDevices({type: 'update', payload: {updatedDevice: updatedDevice, peripheral: peripheral}})
        }
    };

    const handleConnectPeripheral = ({peripheral, status}) => {
        const newDevice: Device = {peripheralId: peripheral, Species: {}, initialized: false};
        updateDevices({type: 'add', payload: {newDevice: newDevice, peripheral: peripheral}});
    };

    // useEffect for initiating listeners to listen to devices
    useEffect(() => {

        // add listener and begin Scanning
        GContext.Bluetooth.bleManagerEmitter.addListener('BleManagerConnectPeripheral',  handleConnectPeripheral);
        GContext.Bluetooth.bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic',  handleUpdateValueForCharacteristic);
        
        return () => {
            // remove listeners
            GContext.Bluetooth.bleManagerEmitter.removeListener('BleManagerConnectPeripheral',  handleConnectPeripheral);
            GContext.Bluetooth.bleManagerEmitter.removeListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic);
        };
    }, []);

    // reduce states out of devices map and return
    return Object.values(devices).map((e) => {
        return e[0];
    });
}
