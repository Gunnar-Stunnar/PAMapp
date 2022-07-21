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

export function connect(peripheral) {
    const GContext = useContext(getGlobalContext())
    console.log(peripheral)
    GContext.Bluetooth.connect(peripheral).then(() => {
        console.log("connected");
    })
}

