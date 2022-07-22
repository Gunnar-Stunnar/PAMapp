import React, { useContext } from "react";
import {Text, StyleSheet, SectionList, View, TouchableOpacity} from "react-native";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faAdd, faTimes } from "@fortawesome/free-solid-svg-icons";

import { connect } from '../../logic/interfaces/bluetoothHooks';
import { getGlobalContext } from '../../logic/services/AppContext';

const DeviceSelectButton = ({onTap, state, size}) =>{
    return (
        <TouchableOpacity onPress={onTap}>
            <View style={
                {
                    backgroundColor: state? "#FF8989":"#89FFAA",
                    borderRadius:size
                }
            }>
                <FontAwesomeIcon icon={state? faTimes:faAdd} size={size}/>
            </View>
        </TouchableOpacity>
    )
}

const SectionTitle = ({title}) => {
    return (<Text style={style.title}>
        {title}
    </Text>);
}

const DeviceRender = ({device}) => {
    const GContext = useContext(getGlobalContext())

    function onTap() {
        device.selected 
        ? GContext.Bluetooth.disconnectDevice(device.id) 
        : GContext.Bluetooth.connectDevice(device.id).then(() => {
            GContext.Bluetooth.writeToPam(device.id, '{"command": 100, "body": "none"}')
        })
    }

    return (
        <View style={style.deviceRenderContainer}>
            <Text style={style.deviceTitle}>{device.title}</Text>
            <DeviceSelectButton onTap={()=> onTap()} state={device.selected} size={42}/>
        </View>
    )
}

const DeviceSelect = ({device_sections}) => {
    return (
        <View style={style.DeviceSelectContainer}>
            <SectionList
            sections={device_sections}
            keyExtractor={(item, index) => index}
            renderItem={({ item }) => <DeviceRender device={item}/>}
            renderSectionHeader={({ section: { title } }) => <SectionTitle title = {title}/>}
            />
        </View>
    )

}


const style = StyleSheet.create({
    deviceRenderContainer:{
        flexDirection:'row',
        margin:10
    },
    deviceTitle:{
        fontSize:24,
        fontWeight:"700",
        flexGrow:1,
    },
    title:{
        textAlign:"left",
        fontWeight:"600",
        fontSize:30,
        color:"#7F7F7F"
    },
    DeviceSelectContainer:{
        padding:10
    }
});

export default DeviceSelect;