import React, { useEffect, useState } from 'react';

import type {Node} from 'react';
import { View } from 'react-native';

import Skeleton from './components/baseScreen';
import Navbar from './components/navBar';

import type {Device} from '../logic/models/device';
import type GraphType from '../logic/models/graphType';

import {NavigationProp, ParamListBase} from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';

import  TrekHistory from './components/trekHistory';
import Graph from './components/graphing/Graph';

import { buildGraph } from './components/graphing/utils';
import type { GraphProp } from '../logic/models/graphType';

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

    let deviceTest: Device = {
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
                            dateTime: Date(),
                            location: {
                                longitude: 1.5,
                                latitude: 2.1,
                                acc: 0.08
                                }
                        },
                        // {
                        //     units: "ppm",
                        //     value: 1.6,
                        //     packetNum: 2,
                        //     dateTime: "Mon Jul 25 2022 11:46:25 GMT-0600 (MDT)",
                        //     location: {
                        //         longitude: 1.5,
                        //         latitude: 2.1,
                        //         acc: 0.08
                        //         }
                        // }  
                    ]
                }
            }
    }




const DeviceMenu = ({route, navigation} : DeviceMenuProps) => {

    const {deviceRef} = route.params;

    const navbar = (
        <Navbar isHome={false} pageTitle={deviceRef.deviceType + " " +deviceRef.ID} navigation={navigation}/>
    )

    const graphs: GraphProp[] = 
            Object.keys(deviceTest.Species)
            .map((e,i) => {
                return {
                    label: e,
                    value: i,
                    data: buildGraph(deviceTest.Species[e])
                }
            });

    const [graphState, updateData] = useState(graphs);

    
    useEffect(()=> {
        setInterval(() => {
            const currentState = deviceTest;
            const packs = currentState.Species['CO'].packets[currentState.Species['CO'].packets.length-1];
        
            const struct = {
                        units: "ppm",
                        value: Math.random(),
                        packetNum: packs.packetNum +1,
                        dateTime: new Date(),
                        location: {
                            longitude: 1.5,
                            latitude: 2.1,
                            acc: 0.08
                            }
            };
    
            currentState.Species['CO'].packets.push(struct);
            
            deviceTest = currentState;

            const graphs: GraphProp[] = 
            Object.keys(deviceTest.Species)
            .map((e,i) => {
                return {
                    label: e,
                    value: i,
                    data: buildGraph(deviceTest.Species[e])
                }
            });

            updateData(graphs);
    
            
    
        }, 1000);
    },[])
    

    const screenStack = [
        {
             title: "",
             data:[
             <Graph graphs={graphState}/>
            ]
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