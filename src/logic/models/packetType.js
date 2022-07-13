import LocationType from "./gps";
import {SpeciesType} from './speciesTypes';
import {Device} from './device';


// Data Object to Represent 
type PacketType {

    // Initial Spawn
    device: Device;

    // Data Point
    units : String;
    value : Number;
    
    // Type & Index
    packetNum: Number;
    species: SpeciesType;   
    dateTime: Date; 
    location: LocationType;

}   


export default PacketType;