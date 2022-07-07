import React from 'react';
import type {Node} from 'react';
import { View, Text} from 'react-native';

import Skeleton from './components/baseScreen';
import Navbar from './components/navBar';
import RecentTreks from './components/recentTrek';
import DeviceView from './components/deviceView';


const devices = {
    name:"PAM 1021",
    battery:2,
    sensors:[
        {
            type: "CO",
            reading: "-0.01",
            unit: "ppm"
        },
        {
            type: "VOC",
            reading: "0.0",
            unit: "ppm"
        },
        {
            type: "PM1",
            reading: "",
            unit: "UGM3"
        },
        {
            type: "CO2",
            reading: "669",
            unit: "ppm"
        },
        {
            type: "PM2.5",
            reading: "",
            unit: "UGM3"
        },
        {
            type: "RELHUM",
            reading: "34.62",
            unit: "%"
        },
        {
            type: "PM10",
            reading: "",
            unit: "UGM3"
        },
        {
            type: "TEMP",
            reading: "21.72",
            unit: "C"
        }
    ],
    
};

const Home: () => Node = () => {

    const navBar = <Navbar isHome={true} pageTitle={""}></Navbar>;
    const screenStack = [
       {
            title: "Recent Treks",
            data:[<RecentTreks/>]
        },
        {
            title: "Devices",
            data:[<DeviceView  devices={devices}/>]
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