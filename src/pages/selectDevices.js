import React, { useEffect, useState } from 'react';
import type {Node} from 'react';
import { View, Button } from 'react-native';

import Skeleton from './components/baseScreen';
import Navbar from './components/navBar';
import DeviceSelect from './components/deviceSelect';

import { useScanning, useConnectedDevices } from '../logic/interfaces/bluetoothHooks';
import type { Device } from '../logic/models/device';

import { useDispatch, useSelector } from 'react-redux';

import { scanDevices, connectDevices } from '../reduxLogic/middleware/bluetoothMiddleWare';



const SelectDevices = ({navigation}) => {

    const dispatch = useDispatch();
    const { Devices, DeviceDiscovery } = useSelector((state: RootState) => state.deviceManager);
    


    const connectedDevices = Devices || [];
    const notConnectedDevices = DeviceDiscovery.discoveredDevices.filter((e) => !connectedDevices.some((connected) => e.id == connected.peripheralId));

    useEffect(()=> {
        dispatch(scanDevices());
    },[])
    

    const connectDeviceHelper = (peripheral) => {
        dispatch(connectDevices(peripheral));
    }

    // function scan() {
    //     [discoveredDevices, isScanning, reload] = useScanning()
    // }

    const navbar = (
        <Navbar isHome={false} pageTitle={"Select Device"} navigation={navigation}/>
    )


    const sections = [
        {
            title:"Paired",
            data: connectedDevices.map((e : Device) => {
                return {
                    title: e.Name,
                    id: e.peripheralId,
                    selected: true,
                    deviceAction: async () => {
                        await disconnectPrepheral(e.peripheralId);
                        forceUpdate();
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
                    deviceAction: ()=>connectDeviceHelper(e)//async () => await connectPrepheral(e, '{"command": 100, "body": "none"}').catch((e)=> console.log("---"+e))
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