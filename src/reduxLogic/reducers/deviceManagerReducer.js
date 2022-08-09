// manages devices internal states

import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Device } from "../models/device"

import { createAsyncThunk } from '@reduxjs/toolkit';
import { parseSetting, parseMessage } from '../utils';


//Typing 
interface DeviceManager {
    Devices: Device[];
}

interface DeviceReference {
    deviceData: Device,
    prepherialID: String
}

interface DeviceStream {
  message: String,
  prepherialID: String
}

// Slicer setup
const DeviceManagerReducer = createSlice({
  name: "DeviceManager",
  initialState: {
    DeviceMap: {},
    Devices: [],
    DeviceDiscovery: {
      discoveredDevices: [],
      refreshing: false
    }
  },
  reducers: {
    addDevice(state, action: PayloadAction<DeviceReference>) {
      
    // add new device
      state.DeviceMap[action.payload.prepherialID] = action.payload.deviceData;

      state.Devices = (Object.values(state.DeviceMap).map(e=>e) || []).filter(e => e?1:0);
    },
    updateDevice(state, action: PayloadAction<DeviceStream>) {
        
    // update selected device
        state.DeviceMap[action.payload.prepherialID].buffer += action.payload.message;
        const currentState = state.DeviceMap[action.payload.prepherialID];
        
        if (currentState.buffer.substring(currentState.buffer.length - 3, currentState.buffer.length) == "end") {
            const updatedDevice: Device = currentState
            
            console.log(updatedDevice);
            console.log(currentState.buffer);

            let message_json = JSON.parse(currentState.buffer.substring(0, currentState.buffer.length - 3))
            parseMessage(message_json, updatedDevice)

            

            updateDevice.buffer = ""
            state.DeviceMap[action.payload.prepherialID] = updateDevice;
        }



        state.Devices = (Object.values(state.DeviceMap).map(e=>e) || []).filter(e => e?1:0);
    },
    removeDevice(state, action: PayloadAction<String>){
    
    // remove selected device
        state.DeviceMap[action.payload.prepherialID] = null;

        state.Devices = (Object.values(state.DeviceMap).map(e=>e) || []).filter(e => e?1:0);
    },
    // DeviceDiscovery
    discoveredDevice(state, action: PayloadAction<Any>){
      state.DeviceDiscovery.discoveredDevices.push(action.payload);
    },
    resetdiscoveredList(state, action: PayloadAction<Any>){
      state.DeviceDiscovery.discoveredDevices = [];
    },
    isRefreshing(state, action: PayloadAction<Boolean>){
      state.DeviceDiscovery.refreshing = action.payload;
    }
  }
});

// exporting
export const { addDevice, 
               updateDevice, 
               removeDevice, 
               isRefreshing, 
               discoveredDevice,
               resetdiscoveredList } = DeviceManagerReducer.actions

export default DeviceManagerReducer.reducer