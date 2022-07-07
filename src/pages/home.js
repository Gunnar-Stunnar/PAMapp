import React from 'react';
import type {Node} from 'react';
import { View, Text} from 'react-native';

import Skeleton from './components/baseScreen';
import Navbar from './components/navBar';
import RecentTreks from './components/recentTrek';


const Home: () => Node = () => {

    const navBar = <Navbar isHome={true} pageTitle={""}></Navbar>;
    const screenStack = [
       {
        title: "Recent Treks",
        data:[<RecentTreks/>]
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