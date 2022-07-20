import React from 'react';
import type {Node} from 'react';
import { View } from 'react-native';

import Skeleton from './components/baseScreen';
import Navbar from './components/navBar';
import DeviceSelect from './components/deviceSelect';

import TrekHistory from './components/trekHistory';

const History = ({navigation}) => {


    const navbar = (
        <Navbar isHome={false} pageTitle={"Trek History"} navigation={navigation}/>
    )

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


    return (<Skeleton 
        navbar={navbar}
        screenStack={[
            {
                title:"",
                data:[<TrekHistory Treks={sections}/>]
            }
        ]}
        />);
 
};


export default History;