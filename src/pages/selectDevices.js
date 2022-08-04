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
    const {devices, connectPrepheral, disconnectPrepheral} = useConnectedDevices();

    
    const [connectedDevices, updateConnectedDevices] = useState([]);
    const [notConnectedDevices, updateNotConnectedDevices] = useState([]);

    const [force, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);

    useEffect(() => {
        const filtedDevices = devices.filter(e => e?1:0);

        console.log(filtedDevices);

        updateConnectedDevices(filtedDevices)
        updateNotConnectedDevices(discoveredDevices.filter((e) => !filtedDevices.some((connected) => (e.id) == connected.peripheralId)))

    }, [devices, discoveredDevices, force]);


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
                    deviceAction: async () => await connectPrepheral(e, '{"command": 100, "body": "none"}').catch((e)=> console.log("---"+e))
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