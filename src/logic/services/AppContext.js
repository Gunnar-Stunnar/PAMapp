import React, { createContext } from 'react';
import { BluetoothModule } from './BluetoothModule'; 
import { StorageModule } from './StorageModule'; 


// private Variable
let globalContext = null;

// intialize the global context
function initializeGlobalContext(){

    console.log("Initalizing global context")
    
    // global services object
    const contextualVariable = {
        'Bluetooth':new BluetoothModule({devicesList: []}),
        'Storage':new StorageModule(),
        'MemoryStorage': null
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

