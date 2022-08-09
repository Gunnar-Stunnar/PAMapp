/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import 'react-native-gesture-handler';

import React from 'react';
import {useEffect} from "react";
import type {Node} from 'react';

import { pages_obj_references } from './pages/nav'


import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';


import { LogBox } from "react-native";
import { Provider } from 'react-redux';

import { store } from './reduxLogic/stateStore';

import {initiateBLE} from './reduxLogic/stateStore';

LogBox.ignoreLogs(["EventEmitter.removeListener"]);

const Stack = createNativeStackNavigator();

// initialize Bluetooth Listeners 
initiateBLE(store.dispatch);

const App: () => Node = () => {

    // initialize adapters 

    return (
        <Provider store={store}>
            <SafeAreaProvider>
                <NavigationContainer>
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false
                    }}
                >
                    {
                    
                        // Build pages of app using pages/nav.js page schematic
                        Object.keys(pages_obj_references).map(
                            
                            (key) => {
                                // console.log(pages_obj_references[key]);

                                return (
                                    <Stack.Screen key={key} name={key} component={pages_obj_references[key]} />
                                )
                            }

                        )

                    }
                </Stack.Navigator>
                </NavigationContainer>
            </SafeAreaProvider>
        </Provider>
      );
 
};


export default App;
