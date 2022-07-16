import React, { createContext } from 'react';
import { BluetoothModule } from './BluetoothModule'; 
import { StorageModule } from './StorageModule'; 


// private Variable
let globalContext = null;

// intialize the global context
function initializeGlobalContext(){
    
    // global services object
    const contextualVariable = {
        'Bluetooth':new BluetoothModule(),
        'Storage':new StorageModule()
    }
    
    globalContext = createContext(contextualVariable);

    return contextualVariable;
}

// get the global context
const getGlobalContext = () => globalContext;


// export public fields
export {
    initializeGlobalContext,
    getGlobalContext
}

