import React, { useEffect, useState } from 'react';
import type {Node} from 'react';
import { View, Button } from 'react-native';

import Skeleton from './components/baseScreen';
import Navbar from './components/navBar';
import DeviceSelect from './components/deviceSelect';

import { useScanning, useConnectedDevices } from '../logic/interfaces/bluetoothHooks';
import type { Device } from '../logic/models/device';


const SelectDevices = ({navigation}) => {

    const [discoveredDevices, isScanning, reload] = useScanning();
    
    const {connectPrepheral, devices, disconnectPrepheral} = useConnectedDevices();

     


    // function scan() {
    //     [discoveredDevices, isScanning, reload] = useScanning()
    // }

    const navbar = (
        <Navbar isHome={false} pageTitle={"Select Device"} navigation={navigation}/>
    )

    const notConnectedDevices = discoveredDevices.filter((e) => !devices.some((connected) => (e.id) == connected.peripheralId));;
    const sections = [
        {
            title:"Paired",
            data: devices.map((e : Device) => {
                return {
                    title: e.Name,
                    id: e.peripheralId,
                    selected: true,
                    deviceAction: async () => {
                        await disconnectPrepheral(e.peripheralId);
                    }
                }
            })
        },
        {
            title:"Pairable",
            data:notConnectedDevices.map((e) => {
                return {
                    title : e.name,
                    id: e.id,
                    selected: false,
                    deviceAction: async () => await connectPrepheral(e, '{"command": 100, "body": "none"}')
                }
            })
        }
    ]



    return (<Skeleton 
        navbar={navbar}
        screenStack={[
            // {
            //     title: "",
            //     data:[<Button title="Refresh" onPress={()=>scan()}/>]
            // },
            {
                title:"",
                data:[<DeviceSelect device_sections={sections}/>]
            }
        ]}
        />);
 
};


export default SelectDevices;