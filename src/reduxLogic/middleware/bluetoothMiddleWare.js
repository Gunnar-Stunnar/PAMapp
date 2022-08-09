import { listenForDevice, connectDevice, writeToPam } from "../services/bluetoothService";
import { resetdiscoveredList, isRefreshing } from "../reducers/deviceManagerReducer";
import { addDevice } from "../reducers/deviceManagerReducer";

const createNewDevice = (peripheral, dispatch) => {
    const newDevice: Device = {peripheralID: peripheral.id, Name:peripheral.name, Species: {}, settings: {}, initialized: false, deviceType:"PAM",  buffer:""};
    dispatch(addDevice({
                deviceData: newDevice,
                prepherialID: peripheral.id
    }));
}

export const bluetoothMiddleWare = store => next => action => {
    
    switch(action.type){
        case "BLE_SCAN":
            console.log("----")
            store.dispatch(resetdiscoveredList());
            store.dispatch(isRefreshing(true));
            listenForDevice(3).then((e)=>{console.log("Scanned")});
            break;
        case "BLE_Connect":
            connectDevice(action.payload).then(async (e)=>{
                console.log("connected!");
                await writeToPam(action.payload.id, `{"command": 100, "body": "none"}`)
            });
            createNewDevice(action.payload, store.dispatch);
            break;
        default:
            next(action);
            break;
    }

  };


export const scanDevices = () => {
    return {
        type:"BLE_SCAN",
    }
} 

export const connectDevices = (peripheral) => {
    return {
        type:"BLE_Connect",
        payload: peripheral
    }
} 