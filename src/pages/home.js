import React, { useState, useEffect } from 'react';
import type {Node} from 'react';
import { View, Text, TouchableOpacity} from 'react-native';

import Skeleton from './components/baseScreen';
import Navbar from './components/navBar';
import RecentTreks from './components/recentTrek';
import DeviceView from './components/deviceView';
import { pages } from './nav';

import type { Device } from '../logic/models/device';

import {NavigationProp, ParamListBase} from '@react-navigation/native';

import { useDeviceInfo } from '../logic/interfaces/bluetoothHooks';
import { useConnectedDevices } from '../logic/interfaces/bluetoothHooks';


interface HomeProps {
    navigation:NavigationProp<ParamListBase>
}


const Home = ({ navigation } : HomeProps) => {

    // const [measurements, settings] = useDeviceInfo()
    const {devices} = useConnectedDevices();
    
    const devicesList = (Object.values(devices).map(e=>e) || []).filter(e => e?1:0);


    const viewHistory = (
        <TouchableOpacity onPress={()=>{navigation.navigate(pages.HISTORY, {})}}>
            <Text style={{color: '#89B1FF', fontSize:24}}>
                View >
            </Text>
        </TouchableOpacity>
    );

    const navBar = <Navbar isHome={true} pageTitle={""} navigation={navigation}></Navbar>;
    const screenStack = [
       {
            title: "Recent Treks",
            action: viewHistory,
            data:[<RecentTreks/>]
        },
        {
            title: "Devices",
            data:[devicesList.map((e, i) => <DeviceView  device={e} navigation={navigation} key={i}/>)]
        }
    ];


    return (
        <Skeleton 
        navbar={navBar}
        screenStack={screenStack}
        />
    );

 
};


export default Home;