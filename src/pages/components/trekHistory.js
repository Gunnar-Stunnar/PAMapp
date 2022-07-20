import React from "react";
import type TreksType from '../../logic/models/treksType';

import {View, Text, SectionList} from 'react-native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { faAngleRight } from '@fortawesome/free-solid-svg-icons';

interface TrekHistoryParams {
    Treks: TreksType[]
}

interface RowParams {
    trek: TreksType;
}


const TrekHistoryRow = ({trek}: RowParams) => {
    console.log(trek)
    return (
        <View style={{
            flexDirection:"row",
            margin:10,
            paddingBottom: 15,
            paddingTop:5,
            borderBottomWidth:1,
            borderStyle:"solid",
            borderBottomColor:"505050"
        }}>
            <View
            style={
                {
                    flexGrow:1
                }
            }
            >
                <Text style={{
                    fontWeight:"600",
                    fontSize:20
                    }}>

                    {trek.name}
                </Text>
                <Text style={{
                    fontWeight:"600",
                    fontSize: 16,
                    color:"#777777",
                    paddingLeft:10
                    }}
                >

                    {trek.date.toLocaleDateString('en-us', {hour:'numeric', minute:'numeric'})}

                </Text>

            </View>
            <View style={
                {
                    alignSelf:"center"
                }
            }>
                <FontAwesomeIcon icon={faAngleRight} size={40}/>
            </View>
        </View>
    )
} 


const TrekHistory = ({Treks} : TrekHistoryParams) => {


    const dateParse = (d : Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()); 
    let dateTrekMap: {[key:Date] : TreksType} = {};

    // loop through treks and organize them by day
    for(const t of Treks){

        console.log(t.date.getFullYear());

        const date_data = dateParse(t.date);

        if(!dateTrekMap[date_data]){
            dateTrekMap[date_data] = [t];
        }
        else {
            dateTrekMap[date_data].push(t);
        }
    }

    
    const sortedDays: Array<Date> = Object.keys(dateTrekMap)
                                          .sort((a,b) => Date.parse(a).getTime() - Date.parse(b)
                                          .getTime()).map(e=>new Date(e));
    let historyStack = [];

    // loop over days and transform them into SectionList format
    for(const day of sortedDays){
        historyStack.push(
            {
                title : day.toLocaleDateString('en-us', {month:"long", day:"numeric", year: 'numeric'}),
                data : dateTrekMap[day]
            }
        )
    }

    console.log(historyStack);

    return (
            <SectionList
                sections={historyStack}
                stickySectionHeadersEnabled
                keyExtractor={(item, index) => index}
                renderItem={({ item }) => <TrekHistoryRow trek={item}/>}
                renderSectionHeader={({ section: { title } }) => 
                <Text
                style={{
                    fontWeight:"700",
                    fontSize:25,
                    textAlign:"right",
                    padding:20,
                    }}
                >{title}</Text>}
                />
    );
}

export default TrekHistory;