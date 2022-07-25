
export type GraphType = {
    label: String;
    minPoint: Number;
    maxPoint: Number;
    minTime: Date;
    maxTime: Date;
    path: Path;
}

export type GraphProp = {
    label: String;
    value: Number;
    data: GraphType;
}

