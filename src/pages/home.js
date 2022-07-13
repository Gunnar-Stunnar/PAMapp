import React from 'react';
import type {Node} from 'react';
import { View, Text, TouchableOpacity} from 'react-native';

import Skeleton from './components/baseScreen';
import Navbar from './components/navBar';
import RecentTreks from './components/recentTrek';
import DeviceView from './components/deviceView';
import { pages } from './nav';


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

const Home = ({ navigation }) => {

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