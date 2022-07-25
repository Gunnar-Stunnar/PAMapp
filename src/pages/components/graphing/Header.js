import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";
import { ReText, Vector, round } from "react-native-redash";
import type { GraphProp } from "../../../logic/models/graphType";
import { SIZEX, SIZEY } from "./utils";

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    paddingBottom:16
  },
  values: {
    marginTop: 0,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  value: {
    fontWeight: "500",
    fontSize: 24,
  },
  label: {
    fontSize: 18,
  },
});

interface HeaderProps {
  translation: Vector<Animated.SharedValue<number>>;
  index: Animated.SharedValue<GraphIndex>;
  graphs: GraphProp;
}

const Header = ({ translation, index, graphs }: HeaderProps) => {
  const data = useDerivedValue(() => graphs[index.value].data);
  const price = useDerivedValue(() => {
    const p = interpolate(
      translation.y.value,
      [0, SIZEY],
      [data.value.maxPrice, data.value.minPrice]
    );
    return `${round(p, 2).toLocaleString("en-US")} ppk`;
  });
  const percentChange = useDerivedValue(
    () => {
        
        const p = interpolate(
            translation.x.value,
            [0, SIZEX],
            [data.value.maxTime, data.value.minTime]
          );
          
        
        const time = (new Date(p)).toLocaleTimeString()

        return `${time}`;
    }//`${round(data.value.percentChange, 3)}%`
  );
  const label = useDerivedValue(() => data.value.label);
  const style = useAnimatedStyle(() => ({
    fontWeight: "500",
    fontSize: 24,
    color: data.value.percentChange > 0 ? "red" : "green",
  }));
  return (
    <View style={styles.container}>
      
      <View style={styles.values}>
        <View>
          <ReText style={styles.value} text={price} />
          <ReText style={styles.label} text={label} />
        </View>
        <View>
          <ReText style={style} text={percentChange} />
        </View>
      </View>
    </View>
  );
};

export default Header;