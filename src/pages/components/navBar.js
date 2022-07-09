import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPlus, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { pages } from '../nav';

const Navbar = (props) => {

    // pull props
    const isHome = props.isHome || false;
    const pageTitle = props.pageTitle || "";
    const navigation = props.navigation;
    // build Home navBar
    if(isHome){

        return (
            <View style={navStyle.container}>
                <Text style={navStyle.title}>Home</Text>  
                <TouchableOpacity onPress={
                    ()=>{
                        navigation.navigate(pages.SELECTED_DEVICES, {})
                    }
                }>
                    <FontAwesomeIcon icon={ faPlus } size={40} />
                </TouchableOpacity>
            </View>
        );

    }   
    
    // build other screens navBar
    return (
        <View style={navStyle.container}>
            <TouchableOpacity onPress={
                    ()=>{
                        navigation.pop()
                    }
                }>
                    <FontAwesomeIcon icon={ faArrowLeft } size={40} />
                </TouchableOpacity>
            <Text style={StyleSheet.compose(navStyle.title, navStyle.generalTitle)}>{pageTitle}</Text>
        </View>
    );

}

const navStyle = StyleSheet.create({
    container: {
        flexDirection: "row",
        backgroundColor: "#0000",
    },
    title: {
        flex: 2,
        fontSize: 30,
        fontWeight: "bold"
      },

    generalTitle:{
        textAlign:"right"
    }
  });

export default Navbar;