import { useState, useEffect, useContext } from 'react';
import { getGlobalContext } from '../services/AppContext';


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

export function getDevices() {
    const [connectedDevices, setConnectedDevices] = useState([]);

    const GContext = useContext(getGlobalContext());

    GContext.Bluetooth.getDevices().then((peripheralsArray) => {
        setConnectedDevices(peripheralsArray)
    })

    return connectedDevices;
}

export function useDeviceInfo() {
    const [measurements, setMeasurements] = useState([])
    const [settings, setSettings] = useState([])

    const GContext = useContext(getGlobalContext());

    const message = "";

    function parseBody(item) {
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
        }
        else if (item["type"] == "measurement") {
            console.log(item["content"]["name"] + ": " + item["content"]["value"] + " " + item["content"]["units"])
        }
        else if (item["type"] == "confirmation") {
            console.log("Changed " + item["content"]["id"] + " to " + item["content"]["newValue"])
        }
    }

    const handleUpdateValueForCharacteristic = (value, peripheral, characteristic, service) => {
        ({ value, peripheral, characteristic, service }) => {
            message += bytesToString(value)
            if (message.substring(message.length - 3, message.length) == "end") {
                console.log(message.substring(0, message.length - 3))
                message_json = JSON.parse(message.substring(0, message.length - 3))
                for (var i = 0; i < message_json["body"].length; i++) {
                    // console.log(message_json["body"][i])
                    parseBody(message_json["body"][i])
                }
                message = ""
            }
        }
    }

    useEffect(() => {
        GContext.Bluetooth.bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic)
        return () => {
            GContext.Bluetooth.bleManagerEmitter.removeListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic)
        }
    }, []);

    return [measurements, settings];
}

export function connect(peripheral) {
    const GContext = useContext(getGlobalContext())
    console.log(peripheral)
    GContext.Bluetooth.connect(peripheral).then(() => {
        console.log("connected");
    })
}

