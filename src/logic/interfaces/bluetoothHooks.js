import { useState, useEffect, useContext, useReducer, useMemo } from 'react';
import { getGlobalContext } from '../services/AppContext';
import type { Device } from '../models/device.js';
import type { SpeciesObj, SpeciesType, ContentType } from '../models/speciesTypes.js';
import type { PacketType } from '../models/packetType.js';
import type { Setting } from '../models/settingsType.js';
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
    const reducer = (state, action) => {
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
    
    const parseSetting = (item) => {
        let setting: Setting = {}

        setting = {
            type: item["type"],
            description: item["description"],
            value: item["currentVal"],
            isDevice: item["isDevice"],
            id: item["id"],
            subSettings: {},
            options: []
        }
        
        if (item["type"] == "menu") {
            for (var i = 0; i < item["items"].length; i++) {
                setting["subSettings"][item["items"][i]["id"]] = parseSetting(item["items"][i]);
            }
        }
        else if (item["type"] == "options") {
            setting["options"] = item["items"];
        }

        return setting;
    }

    const parseMessage = (message, updatedDevice) => {
        
        if (updatedDevice["ID"] == null) {
            updatedDevice["ID"] = Number(message["device"]);
        }

        if (message["status"] == 404) {
            console.log(message["error"])
        }
        else {
            if (message["type"] == "measurements") {
                updatedDevice["batteryLevel"] = message["battery"];
                for (var i = 0; i < message["body"].length; i++) {
                    let packetNum = 0
                    let item = message["body"][i]
                    if (updatedDevice.Species[item["name"]] == null) {
                        // TODO: check if any of the species info needs updating?
                        updatedDevice.Species[item["name"]] = {species: {name: item["name"], units: item["units"]}, packets: []};
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
                    // console.log(updatedDevice.Species[item["name"]].packets)
                }
            }
            else if (message["type"] == "settings") {
                for (var i = 0; i < message["body"].length; i++) {
                    let item = message["body"][i];
                    updatedDevice.settings[item["id"]] = parseSetting(item)
                    // console.log(updatedDevice.settings[item["id"]])
                }
            }
        }
    }
    
    var message = "";
    const handleUpdateValueForCharacteristic = ({ value, peripheral, characteristic, service }) => {


        message += bytesToString(value)
        if (message.substring(message.length - 3, message.length) == "end") {
            const updatedDevice: Device = devices[peripheral]
            // console.log(updatedDevice);
            // console.log(message.substring(0, message.length - 3))
            let message_json = JSON.parse(message.substring(0, message.length - 3))
            parseMessage(message_json, updatedDevice)
            message = ""
            // console.log(updatedDevice)
            updateDevices({type: 'update', payload: {updatedDevice: updatedDevice, peripheral: peripheral}})
        }
    };


    

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


    const connectPrepherial = async (peripheral, intialMessage) => {
        
        // Connect Prepherial 
        await GContext.Bluetooth.connectDevice(peripheral);
        await GContext.Bluetooth.writeToPam(peripheral.id, intialMessage);

        // update state with infromation 
        const newDevice: Device = {peripheralId: peripheral.id, Name: peripheral.name, Species: {}, settings: {}, initialized: false, deviceType:"PAM"};
        updateDevices({type: 'add', payload: {newDevice: newDevice, peripheral: peripheral.id}});

    };

    const disconnectDevice = async (peripheralID : String) => {

        //disconnect devices
        await GContext.Bluetooth.disconnectDevice(peripheralID);
        
        //update statemangment
        updateDevices({type: 'remove', payload: {peripheral: peripheralID}});        
    } 

    // reduce states out of devices map and return
    return { 'devices': devices,
             'connectPrepheral': connectPrepherial,
             'disconnectPrepheral': disconnectDevice
    };
}
