import React from "react";
import {Text, StyleSheet, SectionList, View, TouchableOpacity} from "react-native";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faAdd, faTimes } from "@fortawesome/free-solid-svg-icons";

const DeviceSelectButton = ({onTap, state, size}) =>{
    return (
        <TouchableOpacity onTap={onTap}>
            <View style={
                {
                    backgroundColor: state? "#89FFAA":"#FF8989",
                    borderRadius:size
                }
            }>
                <FontAwesomeIcon icon={state? faAdd:faTimes} size={size}/>
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
    return (
        <View style={style.deviceRenderContainer}>
            <Text style={style.deviceTitle}>{device.title}</Text>
            <DeviceSelectButton onTap={()=>{}} state={device.selected} size={42}/>
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
        textAlign:"center",
        fontWeight:"600",
        fontSize:30,
        color:"#7F7F7F"
    },
    DeviceSelectContainer:{
        padding:10
    }
});

export default DeviceSelect;