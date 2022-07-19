import React from 'react';

import type {Node} from 'react';
import { View } from 'react-native';

import Skeleton from './components/baseScreen';
import Navbar from './components/navBar';

import type {Device} from '../logic/models/device';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';

interface DeviceMenuProps {
    route : RouteProp<{ params: { deviceRef: Device } }, 'params'>;
    navigation: NavigationProp<ParamListBase>;
  }

const DeviceMenu = ({route, navigation} : DeviceMenuProps) => {

    const {deviceRef} = route.params;

    const navbar = (
        <Navbar isHome={false} pageTitle={deviceRef.ID} navigation={navigation}/>
    )
    const screenStack = [
        {
             title: "Graph",
             data:[]
         },
         {
            title: "History",
            data:[]
        },
     ];

    return (
    <Skeleton 
        navbar={navbar}
        screenStack={screenStack}
    />);

 
};



export default DeviceMenu;