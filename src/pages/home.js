import React from 'react';
import type {Node} from 'react';
import { View, Text, TouchableOpacity} from 'react-native';

import Skeleton from './components/baseScreen';
import Navbar from './components/navBar';
import RecentTreks from './components/recentTrek';
import DeviceView from './components/deviceView';
import { pages } from './nav';

import type { Device } from '../logic/models/device';

import {NavigationProp, ParamListBase} from '@react-navigation/native';

interface HomeProps {
    navigation:NavigationProp<ParamListBase>
}

const devices: Device[] = [
    {
        ID: 1092,
        deviceType: "PAM",
        connection: {},
        batteryLevel: 0,
        Species: {
            "CO":{
                species:{
                    type:"CO",
                    content:{
                        name:"Carbon monoxide",
                        units:"ppm"
                    }
                },
                packets:[
                  {
                    units: "ppm",
                    value: 1.5,
                    packetNum: 1,
                    dateTime: Date().toString(),
                    location: {
                        longitude: 1.5,
                        latitude: 2.1,
                        acc: 0.08
                        }
                    }  
                ]
            },
            "CO2":{
                species:{
                    type:"CO2",
                    content:{
                        name:"Carbon dioxide",
                        units:"ppm"
                    }
                },
                packets:[
                  {
                    units: "ppm",
                    value: 1.5,
                    packetNum: 1,
                    dateTime: Date().toString(),
                    location: {
                        longitude: 1.5,
                        latitude: 2.1,
                        acc: 0.08
                        }
                    }  
                ]
            }
        }
    }
];
// const devices = {
//     name:"PAM 1021",
//     battery : 2,
//     sensors:[
//         {
//             type: "CO",
//             reading: "-0.01",
//             unit: "ppm"
//         },
//         {
//             type: "VOC",
//             reading: "0.0",
//             unit: "ppm"
//         },
//         {
//             type: "PM1",
//             reading: "",
//             unit: "UGM3"
//         },
//         {
//             type: "CO2",
//             reading: "669",
//             unit: "ppm"
//         },
//         {
//             type: "PM2.5",
//             reading: "",
//             unit: "UGM3"
//         },
//         {
//             type: "RELHUM",
//             reading: "34.62",
//             unit: "%"
//         },
//         {
//             type: "PM10",
//             reading: "",
//             unit: "UGM3"
//         },
//         {
//             type: "TEMP",
//             reading: "21.72",
//             unit: "C"
//         }
//     ],
    
// };

const Home = ({ navigation } : HomeProps) => {

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
            data:[devices.map((e,i) => <DeviceView  device={e} navigation={navigation} key={i}/>)]
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