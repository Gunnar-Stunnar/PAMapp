import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPlus, fa } from '@fortawesome/free-solid-svg-icons'


const Navbar = (props) => {

    // pull props
    const isHome = props.isHome || false;
    const pageTitle = props.pageTitle || "";

    // build Home navBar
    if(isHome){

        return (
            <View style={navStyle.container}>
                <Text style={navStyle.title}>Home</Text>
                <FontAwesomeIcon icon={ faPlus } size={40} />
            </View>
        );

    }   
    
    
    return (
        <View style={navStyle.container}>
            <FontAwesomeIcon icon={ faPlus } size={40}/>
            <Text style={navStyle.title}>{pageTitle}</Text>
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
  });

export default Navbar;