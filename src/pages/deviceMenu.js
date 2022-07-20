import React from 'react';

import type {Node} from 'react';
import { View } from 'react-native';

import Skeleton from './components/baseScreen';
import Navbar from './components/navBar';

import type {Device} from '../logic/models/device';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';

import  TrekHistory from './components/trekHistory';

interface DeviceMenuProps {
    route : RouteProp<{ params: { deviceRef: Device } }, 'params'>;
    navigation: NavigationProp<ParamListBase>;
  }


  const sections = [
    {
        name: "Trip around lake.",
        date: new Date(),
        device: {}
    },
    {
        name: "Trip around lake 2.",
        date: new Date(),
        device: {}
    }
]

const DeviceMenu = ({route, navigation} : DeviceMenuProps) => {

    const {deviceRef} = route.params;

    const navbar = (
        <Navbar isHome={false} pageTitle={deviceRef.deviceType + " " +deviceRef.ID} navigation={navigation}/>
    )
    const screenStack = [
        {
             title: "",
             data:[]
         },
         {
            title: "Treks",
            data:[
                <TrekHistory Treks={sections}/>
            ]
        },
     ];

    return (
    <Skeleton 
        navbar={navbar}
        screenStack={screenStack}
    />);

 
};



export default DeviceMenu;