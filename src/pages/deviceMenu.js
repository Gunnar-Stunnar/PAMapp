import React from 'react';

import type {Node} from 'react';
import { View } from 'react-native';

import Skeleton from './components/baseScreen';
import Navbar from './components/navBar';

import type {Device} from '../logic/models/device';


export interface DeviceMenuProps {
    device: Device;
  }

const DeviceMenu = ({device}:DeviceMenuProps) => {



    const navbar = (
        <Navbar isHome={false} pageTitle={device.ID} navigation={navigation}/>
    )
    const screenStack = [
        {
             title: "Graph",
             data:[<RecentTreks/>]
         },
     ];

    return (
    <Skeleton 
        navbar={navbar}
        screenStack={screenStack}
    />);

 
};



export default DeviceMenu;