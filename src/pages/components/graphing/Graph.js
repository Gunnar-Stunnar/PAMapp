import React from "react";
import { Text, View, StyleSheet, Dimensions } from "react-native";
import Svg, { Path, LinearGradient, Stop, Defs } from "react-native-svg";
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { mixPath, useVector } from "react-native-redash";

import {SIZEX, SIZEY } from './utils';
// import {GraphIndex} from './utils';

import Header from "./Header";
import Cursor from "./Cursor";

import type {GraphProp} from "../../../logic/models/graphType";

const { width } = Dimensions.get("window");
const AnimatedPath = Animated.createAnimatedComponent(Path);




interface GraphProps {
    graphs: GraphProp[]
}

const Graph = ({ graphs } : GraphProps) => {
 
  const SELECTION_WIDTH = width - 32;
  const BUTTON_WIDTH = (width - 32) / graphs.length; 
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16,
      // backgroundColor: "white",
    },
    backgroundSelection: {
      backgroundColor: "#FFAA50",
      ...StyleSheet.absoluteFillObject,
      width: BUTTON_WIDTH,
      borderRadius: 8,
    },
    selection: {
      flexDirection: "row",
      width: SELECTION_WIDTH,
      alignSelf: "center",
    },
    labelContainer: {
      padding: 5,
      alignContent:"center",
      width: BUTTON_WIDTH,
    },
    label: {
      fontSize: 16,
      color: "black",
      fontWeight: "bold",
      textAlign: "center",
    },
  });


  const translation = useVector();
  const transition = useSharedValue(0);
  const previous = useSharedValue(0);
  const current = useSharedValue(0);

  const animatedProps = useAnimatedProps(() => {

    const previousPath = graphs[previous.value].data.path;
    const currentPath = graphs[current.value].data.path;

    return {
      d: mixPath(transition.value, previousPath, currentPath),
    };
  });

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: withTiming(BUTTON_WIDTH * current.value) }],
  }));

  return (
    <View style={styles.container}>
      <Header translation={translation} index={current} graphs={graphs}/>
      <View>
        <Svg width={SIZEX} height={SIZEY}>
            {/* Graph backGround Gradient */}
            <Defs>
                <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#FF4747" stopOpacity="1" />
                <Stop offset={0.5} stopColor="#FFE455" stopOpacity="1" />
                <Stop offset={1} stopColor="#53FF76" stopOpacity="1" />
                </LinearGradient>
            </Defs>
                {/* Animated Path */}
                <AnimatedPath
                    animatedProps={animatedProps}
                    fill="transparent"
                    stroke="url(#grad)"
                    strokeLinecap="round"
                    strokeWidth={3}
                />
            
        </Svg>
        <Cursor translation={translation} index={current} graphs={graphs}/>
      </View>
      <View style={styles.selection}>
        <View style={StyleSheet.absoluteFill}>
          <Animated.View style={[styles.backgroundSelection, style]} />
        </View>
        {graphs.map((graph, index) => {
          return (
            <TouchableWithoutFeedback
              key={graph.label}
              onPress={() => {
                previous.value = current.value;
                transition.value = 0;
                current.value = index;
                transition.value = withTiming(1);
              }}
            >
              <Animated.View style={[styles.labelContainer]}>
                <Text style={styles.label}>{graph.label}</Text>
              </Animated.View>
            </TouchableWithoutFeedback>
          );
        })}
      </View>
    </View>
  );
};

export default Graph;