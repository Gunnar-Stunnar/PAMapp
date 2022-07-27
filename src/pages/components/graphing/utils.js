import * as shape from "d3-shape";
import { scaleLinear } from "d3-scale";
import { Dimensions } from "react-native";
import { parse } from "react-native-redash";

import type { SpeciesObj } from "../../../logic/models/speciesTypes";

import type GraphType from "../../../logic/models/graphType";

export const internal_graph_padding = 5;

export const SIZEY = Dimensions.get("window").width / 2;
export const SIZEX = Dimensions.get("window").width - 16*2;

export const NUM_POINTS = 60;

export const buildGraph: (SpeciesObj) => GraphType = (species: SpeciesObj) => {
    
    const PointList = species.packets.slice(0, NUM_POINTS);
    const label = species.species.type;

    const formattedValues = PointList.map(
      (Point) => [parseFloat(Point.value), new Date(Point.dateTime)]
    );

    const Points = formattedValues.map((value) => value[0]);
    const dates = formattedValues.map((value) =>  value[1]);

    //scaling 
    const scaleX = scaleLinear()
      .domain([Math.min(...dates), Math.max(...dates)])
      .range([internal_graph_padding, SIZEX-internal_graph_padding]);
    
      const minPoint = Math.min(...Points);
    const maxPoint = Math.max(...Points);
    const scaleY : (Number) => Number = scaleLinear()
      .domain([minPoint, maxPoint])
      .range([SIZEY - internal_graph_padding, internal_graph_padding]);
  


    return {
      label,
      minPoint,
      maxPoint,
      minTime:Math.min(...dates),
      maxTime:Math.max(...dates),
      // percentChange: datapoints.percent_change,
      path: parse(
        shape
          .line()
          .x(([, x]) => scaleX(x))
          .y(([y]) => scaleY(y))
          .curve(shape.curveBasis)(formattedValues) 
      ),
    };
    
  };