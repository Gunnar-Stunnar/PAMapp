import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {  } from "@fortawesome/free-solid-svg-icons";
import { faBattery0, faBattery2, faBattery3, faBattery4, faBattery5, faBattery } from "@fortawesome/free-solid-svg-icons";


const battery_icons = [faBattery0, faBattery, faBattery2, faBattery3, faBattery4, faBattery5];
const battery_colors = ["#FF8989","#FF8989" ,"#89B1FF"  ,"#89B1FF"  ,"#89FFAA"  ,"#89FFAA"  ]

const BatteryIcon = ({level}) => {
    
    if (level > 5){
        level = 5;
    } else if (level < 0) {
        level = 0;
    }

    return (
        <FontAwesomeIcon
            icon={battery_icons[level]}
            color={battery_colors[level]}
            size={52}
        />
    );
}

export default BatteryIcon;