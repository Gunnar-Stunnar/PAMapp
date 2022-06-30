import { createContext } from 'react';
import { BluetoothModule } from './BluetoothModule'; 
import { StorageModule } from './StorageModule'; 


// private Variable
let globalContext = null;

// intialize the global context
function initializeGlobalContext(){
    
    // global services object
    const contextualVariable = {
        'bluetooth':BluetoothModule(),
        'Storage':StorageModule()
    }
    
    globalContext = createContext(contextualVariable);
}

// get the global context
const getGlobalContext = () => globalContext;


// export public fields
export default {
    ...initializeGlobalContext,
    ...getGlobalContext
}

