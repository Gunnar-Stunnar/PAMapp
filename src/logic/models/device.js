import ConnectionType from './connectionType';
import {SpeciesObj, SpeciesEnum} from './speciesTypes';


// Device type, represent physical device as object
type Device = {
    ID: Number;
    batteryLevel: Number;
    deviceType: "PAM" | "CAM" | "RemotePAM" | "NoDevice";
    connection: ConnectionType;
    Species: { [key: SpeciesEnum] : SpeciesObj}; 
    
}

export {Device};