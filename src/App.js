/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';

import { pages_obj_references } from './pages/nav';
import appContext from './logic/services/AppContext';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();
const App: () => Node = () => {

    // initialize adapters 
    appContext.initializeGlobalContext();

    return (
        // <appContext.getGlobalContext.Provider>
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
                            console.log(pages_obj_references[key]);

                            return (
                                <Stack.Screen key={key} name={key} component={pages_obj_references[key]} />
                            )
                        }

                    )

                }
            </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
      );
 
};


export default App;
