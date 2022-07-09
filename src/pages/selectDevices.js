import React from 'react';
import type {Node} from 'react';
import { View } from 'react-native';

import Skeleton from './components/baseScreen';
import Navbar from './components/navBar';
import DeviceSelect from './components/deviceSelect';

const SelectDevices = ({navigation}) => {


    const navbar = (
        <Navbar isHome={false} pageTitle={"Select Device"} navigation={navigation}/>
    )

    const sections = [
        {
            title:"Paired",
            data:[
                {
                title:"PAM 1021",
                selected:true
                },
                {
                    title:"PAM 1032",
                    selected:true
                }
        ]
        },
        {
            title:"Pariable",
            data:[{
                title:"PAM 1042",
                selected:false
            }]
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