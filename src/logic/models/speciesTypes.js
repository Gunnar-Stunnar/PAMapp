import PacketType from "./packetType";


type contentType = {
    name: String;
    units: String;
}

type SpeciesType =  {
    type: String;
    content: contentType; //TODO: TBD - could be various objects
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