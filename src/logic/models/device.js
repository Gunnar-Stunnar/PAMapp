import ConnectionType from './connectionType';
import {SpeciesObj, SpeciesType} from './speciesTypes';
import {Setting} from '../models/settingsType';

// Device type, represent physical device as object
type Device = {
    ID: Number;
    batteryLevel: Number;
    peripheralID: String;
    deviceType: "PAM" | "CAM" | "RemotePAM" | "NoDevice";
    connection: ConnectionType;
    Species: { [key: String] : SpeciesObj}; 
    Settings: { [key: String] : Setting};
    initialized: boolean;
}

export { Device };