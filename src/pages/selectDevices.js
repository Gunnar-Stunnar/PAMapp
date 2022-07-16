import React from 'react';
import type {Node} from 'react';
import { View } from 'react-native';

import Skeleton from './components/baseScreen';
import Navbar from './components/navBar';
import DeviceSelect from './components/deviceSelect';

import { useScanning } from '../logic/interfaces/bluetoothHooks';

const SelectDevices = ({navigation}) => {

    const [discoveredDevices, isScanning, reload] = useScanning()

    const navbar = (
        <Navbar isHome={false} pageTitle={"Select Device"} navigation={navigation}/>
    )

    const sections = [
        {
            title:"Paired",
            data:[]
        },
        {
            title:"Pariable",
            data:discoveredDevices.map((e) => {
                return {
                    title : e.name,
                    selected: false
                }
            })
        }
    ]


    return (<Skeleton 
        navbar={navbar}
        screenStack={[
            {
                title:"",
                data:[<DeviceSelect device_sections={sections}/>]
            }
        ]}
        />);
 
};


export default SelectDevices;