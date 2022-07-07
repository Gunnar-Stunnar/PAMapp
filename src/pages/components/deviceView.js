import React from "react";
import {View, Text, StyleSheet} from 'react-native';
import BatteryIcon from './battery';


const SensorCell = ({sensor, style2}) => {
    
    return (
        <View style={StyleSheet.compose(style.sensorCell, style2)}>
            <Text style={style.sensorType}>{sensor.type}</Text>
            <Text style={style.sensorReading}>{sensor.reading} {sensor.unit}</Text>
        </View>
    );
}

const RowView = ({sensor1, sensor2}) => {
    return (
            <View style={style.sensorRowContainer}>
                <SensorCell sensor={sensor1} style2={style.sensorCellContainerLeft}/>
                <SensorCell sensor={sensor2} style2={style.sensorCellContainerRight}/>
            </View>
            );
}

const SensorTable = ({sensors}) => {
     // rendering
     const sensorTable = [];
    
     for(let i = 0; i < sensors.length; i+=2){
         sensorTable.push(
             <RowView sensor1={sensors[i]} sensor2={sensors[i + 1]} key={i}/>
         );                
     }
    
    return (
        <View style={style.sensorTableContainer}>
                {
                 sensorTable   
                } 
        </View>
    )
}

const QuailtyView = ({isGood}) => {
    return (
        <View style={
            {
                alignSelf:"center",
                backgroundColor: (isGood? "#89FFAA":"#FF8989"),
                padding: 20,
                width:"100%",
                borderRadius:25
            }
        }>
            <Text style={
            {
                textAlign:"center",
                width:"100%",
                fontSize:48,
                fontWeight:"600"
            }
        }
            >
                {
                    isGood? "Good":"Bad"
                } 
            </Text>
        </View>
    );
}

const DeviceView = ({devices}) => {

    const deviceName = devices.name;
    const sensors = devices.sensors; 
    const deviceBattery = devices.battery;
    
   

    return (
        <View style={style.container}>
            
            {/* Device View Title */}
            <View style={style.titleContainer}>
                <Text style={style.title}>
                    {deviceName}
                </Text>
                <BatteryIcon level = {deviceBattery}/>
            </View>
            
            {/* Sensor Table */}
            <SensorTable sensors={sensors}/> 
            <QuailtyView isGood={true}/>
        </View>
    );
}


const style = StyleSheet.create({
    container:{
        flexDirection:"column",
        marginHorizontal:10,
        backgroundColor:"#EAEAEA",
        padding:10,
        borderRadius:15
    },

    titleContainer:{
        flexDirection:"row"
    },
    title:{
        fontWeight: "700",
        fontSize: 35,
        flexGrow:1,
    },

    sensorTableContainer:{
        marginVertical:10
    },
    sensorRowContainer:{
        flexDirection:"row",
        width:"100%",
        borderBottomColor:"black",
        borderBottomWidth:1
    },

    sensorCellContainerLeft:{
        borderRightWidth:1,
        borderRightColor:"black"
    },
    sensorCellContainerRight:{
        borderLeftWidth:0,
        borderLeftColor:"black"
    },

    sensorCell:{
        flexDirection:"row",
        width:"50%",
        padding:5, 
    },

    sensorType:{
        flexGrow:1,
        fontSize:16,
        fontWeight:"600"
    },
    sensorReading:{
        fontSize:16,
        fontWeight:"600"
    }

}); 


export default DeviceView;