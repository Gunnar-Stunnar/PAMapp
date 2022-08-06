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
import {initializeGlobalContext, getGlobalContext} from './logic/services/AppContext';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useDeviceManager } from './logic/interfaces/bluetoothHooks';

import { LogBox } from "react-native";

LogBox.ignoreLogs(["EventEmitter.removeListener"]);

const Stack = createNativeStackNavigator();
const init_value = initializeGlobalContext();

const App: () => Node = () => {

    // initialize adapters 
    const GContext = getGlobalContext();

    const deviceManager = useDeviceManager();
    init_value.MemoryStorage = deviceManager;

    return (
        <GContext.Provider value={init_value}>
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
            </GContext.Provider>
      );
 
};


export default App;
