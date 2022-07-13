import ConnectionType from './connectionType';
import {SpeciesObj, SpeciesEnum} from './speciesTypes';

// enum for type of device
enum DeviceTypes {
    Pam = 1,
    CAM = 2,
    RemotePAM  = 3,
    NoDevice = 4  
}

// Device type, represent physical device as object
type Device = {
    ID: Number;
    deviceType: DeviceTypes;
    connection: ConnectionType;
    Species: { [key: SpeciesEnum] : SpeciesObj}; 
}

export {Device, DeviceTypes};