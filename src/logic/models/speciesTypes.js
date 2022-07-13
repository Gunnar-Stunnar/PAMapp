import PacketType from "./packetType";


type contentType {
    name: String;
    units: String;
}

type SpeciesType {
    type: String;
    content: contentType; //TODO: TBD - could be various objects
}

type SpeciesObj {
    speices: SpeciesType;
    packets: PacketType[];
}

export {
    SpeciesType
    SpeciesObj
};