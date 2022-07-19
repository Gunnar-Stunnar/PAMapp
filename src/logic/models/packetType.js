import LocationType from "./gps";
import {SpeciesType} from './speciesTypes';
import {Device} from './device';


// Data Object to Represent 
type PacketType {

    // Initial Spawn
    // device: Device;

    // Data Point
    units : String;
    value : Number;
    
    // Type & Index
    packetNum: Number;
    // species: SpeciesType;    
    dateTime: Date; 
    location: LocationType;

}   


/*
    {
        units: "ppm",
        value: 1.5,
        packetNum: 1,
        dateTime: Date().now(),
        location: {
            longitude: 1.5;
            latitude: 2.1;
            acc: 0.08; 
        }
    }
*/  


export default PacketType;