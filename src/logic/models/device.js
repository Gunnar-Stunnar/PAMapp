import ConnectionType from './connectionType';
import {SpeciesObj, SpeciesType} from './speciesTypes';



// Device type, represent physical device as object
type Device = {
    Name : String;
    ID : Number;
    peripheralId:String;
    isConnected:Boolean;
    batteryLevel: Number;
    peripheralId: String;
    deviceType: "PAM" | "CAM" | "RemotePAM" | "NoDevice";
    connection: ConnectionType;
    Species: { [key: String] : SpeciesObj}; 
    initialized: boolean;
}

export { Device };