import ConnectionType from './connectionType';
import {SpeciesObj} from './speciesTypes';


// Device type, represent physical device as object
type Device = {
    ID: Number;
    batteryLevel: Number;
    deviceType: "PAM" | "CAM" | "RemotePAM" | "NoDevice";
    connection: ConnectionType;
    Species: { [key: String] : SpeciesObj}; 
    
}

export { Device };