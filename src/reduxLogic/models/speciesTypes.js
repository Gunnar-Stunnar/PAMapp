import PacketType from "./packetType";

type SpeciesType = {
    name: String;
    units: String;
}

type SpeciesObj = {
    species: SpeciesType;
    packets: PacketType[];
}

export {
    SpeciesType,
    SpeciesObj
}

/*

{
    species:{
        type:"CO",
        content:{
            name:"Carbon Dioxide",
            units:"ppm"
        }
    },
    packets:[
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
    ]
}

*/