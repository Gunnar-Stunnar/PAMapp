import { useState, useEffect, useContext, useReducer, useMemo } from 'react';
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


      // remove devices already connected

      return [devices, isScanning, reload];
}

export function useConnectedDevices() {
    // const [connectedDevices, setConnectedDevices] = useState([]);

    const GContext = useContext(getGlobalContext());

    const deviceManger = GContext['MemoryStorage'];

    return deviceManger;
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
                    state[action.payload.peripheral] = {...action.payload.updatedDevice, ...state[action.payload.peripheral]}
                    return state;
            
                case 'remove':
                    state[action.payload.peripheral] = null;
                    return state;

                default:
                    throw new Error();
            }
        }

    const [devices: {[key : String] : Device}, updateDevices] = useReducer(reducer, {});
    
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
                updatedDevice.Name = Number(item["content"]["currentVal"])
            }
        }
        else if (item["type"] == "measurement") {
            let packetNum = 0
            if (item["content"]["name"] !== "LAT" && item["content"]["name"] !== "LON" && item["content"]["name"] !== "Battery") {
                if (updatedDevice.Species[item["content"]["name"]] == null) {
                    updatedDevice.Species[item["content"]["name"]] = {species: {type: "measurement", content: {name: item["content"]["name"], units: item["content"]["units"]}}, packets: []};
                }
                else {
                    packetNum = updatedDevice.Species[item["content"]["name"]].packets.length;
                }
                if (item["content"]["value"] !== "N/A") {
                    updatedDevice.Species[item["content"]["name"]].packets.push({
                        units: item["content"]["units"], 
                        value: Number(item["content"]["value"]), 
                        packetNum: packetNum, 
                        dateTime: new Date(),
                        location: {
                            longitude: longitude,
                            latitude: latitude
                        }
                    });
                }
                console.log(updatedDevice.Species[item["content"]["name"]].packets)
            }
            // console.log(item["content"]["name"] + ": " + item["content"]["value"] + " " + item["content"]["units"])
        }
        else if (item["type"] == "confirmation") {
            console.log("Changed " + item["content"]["id"] + " to " + item["content"]["newValue"])
        }
    }
    
    var message = "";
    const handleUpdateValueForCharacteristic = ({ value, peripheral, characteristic, service }) => {


        message += bytesToString(value)
        if (message.substring(message.length - 3, message.length) == "end") {
            const updatedDevice: Device = devices[peripheral]
            console.log(message.substring(0, message.length - 3))
            let message_json = JSON.parse(message.substring(0, message.length - 3))
            let latitude = 0;
            let longitude = 0;
            for (var i = 0; i < message_json["body"].length; i++) {
                if (message_json["body"][i]["type"] == "measurement") {
                    if (message_json["body"][i]["content"]["name"] == "LAT") {
                        latitude = message_json["body"][i]["content"]["value"];
                    }
                    else if (message_json["body"][i]["content"]["name"] == "LON") {
                        longitude = message_json["body"][i]["content"]["value"];
                    }
                    else if (message_json["body"][i]["content"]["name"] == "Battery") {
                        updatedDevice["batteryLevel"] = Number(message_json["body"][i]["content"]["value"]);
                    }
                }
            }
            for (var i = 0; i < message_json["body"].length; i++) {
                parseBody(message_json["body"][i], updatedDevice, latitude, longitude)
            }
            message = ""
            console.log(updatedDevice)
            updateDevices({type: 'update', payload: {updatedDevice: updatedDevice, peripheral: peripheral}})
        }
    };

    const connectPrepherial = async (peripheral, intialMessage) => {
        
        // Connect Prepherial 
        await GContext.Bluetooth.connectDevice(peripheral);
        await GContext.Bluetooth.writeToPam(peripheral.id, intialMessage);

        // update state with infromation 
        const newDevice: Device = {peripheralId: peripheral.id, Name: peripheral.name, Species: {}, initialized: false, deviceType:"PAM"};
        updateDevices({type: 'add', payload: {newDevice: newDevice, peripheral: peripheral.id}});

    };

    const disconnectDevice = async (peripheralID : String) => {

        //disconnect devices
        await GContext.Bluetooth.disconnectDevice(peripheralID);
        
        //update statemangment
        updateDevices({type: 'remove', payload: {peripheral: peripheralID}});        
    } 
    

    // useEffect for initiating listeners to listen to devices
    useEffect(() => {

        // add listener and begin Scanning
        // GContext.Bluetooth.bleManagerEmitter.addListener('BleManagerConnectPeripheral',  handleConnectPeripheral);
        GContext.Bluetooth.bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic',  handleUpdateValueForCharacteristic);
        
        return () => {
            // remove listeners
            // GContext.Bluetooth.bleManagerEmitter.removeListener('BleManagerConnectPeripheral',  handleConnectPeripheral);
            GContext.Bluetooth.bleManagerEmitter.removeListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic);
        };
    }, []);


    // reduce states out of devices map and return
    return { 'devices': Object.values(devices).map((e) => {
                return e;
            }) || [],
             'connectPrepheral':    connectPrepherial,
             'disconnectPrepheral': disconnectDevice
};
}
