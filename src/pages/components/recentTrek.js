import React from 'react';
import {View, ScrollView, StyleSheet, Text} from 'react-native';

// Trek block object
const TrekBlock = (props) => {
    
    props = props.trekObj;

    const device_num = props.device_num;
    const trek_date = props.trek_date;

    const trek_start = props.trek_start;
    const trek_end = props.trek_end;
    

    return (
        <View style={TrekBlock_style.trekBlockContainer}>
            
            <Text style={TrekBlock_style.trekBlockTitle}>{device_num}</Text>

            <Text style={TrekBlock_style.trekBlockDate}> {trek_date} </Text>

            <View style={TrekBlock_style.trekBlockTimeContainer}>
                <Text style={TrekBlock_style.trekBlockTime}>Start: {trek_start}</Text>
                <Text style={TrekBlock_style.trekBlockTime}>End:   {trek_end}</Text>
            </View>

        </View>
    );

}

const size_multiple = 1.2;
const TrekBlock_style = StyleSheet.create({
    
    trekBlockContainer:{
        flexDirection:"column",
        backgroundColor:"#EAEAEA",
        padding: 5,
        width: 115*size_multiple,
        height:100*size_multiple,
        borderRadius:15,
        marginRight: 10
        },

    trekBlockTitle:{
        fontSize:24*size_multiple,
        fontWeight:"700",
        flexGrow:2,
        },

    trekBlockDate: {
        fontSize:12*size_multiple,
        fontWeight:"700",
        flexGrow:2
        },
    trekBlockTimeContainer:{
        flexGrow:1,
        marginLeft: 3
        },
    trekBlockTime:{
        fontSize:13*size_multiple,
        
        fontWeight:"400",
        }   
    
    });

// Recent Trek section
const RecentTreks = (props) => {

    const example_treks = [
        {
            device_num : "1021",
            trek_date : "June 12, 2020",
            trek_start : "10:45PM",
            trek_end : "11:00PM"
        },
        {
            device_num : "1032",
            trek_date : "June 10, 2020",
            trek_start : "10:13AM",
            trek_end : "10:30AM"
        },
        {
            device_num : "1032",
            trek_date : "June 9, 2020",
            trek_start : "9:45PM",
            trek_end : "10:00PM"
        }
    ]


    return (
        <View>
        <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        >
            <View width={15}/>
            {
                // generate top n amount of recent Treks
                example_treks.map((e,i)=>{
                    return <TrekBlock  trekObj={e} key={i}/>
                })

            }
            <View width={15}/>
        </ScrollView>
        </View>
    );
}


export default RecentTreks;