import 'react-native-gesture-handler';
import React from 'react';
import {
  Button,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import {
  GestureHandlerRootView,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import Card from './src/components/Card';
import Animated, {
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import users from './src/data/user.js';

const App = () => {
  const {width: screenWidth} = useWindowDimensions();
  const translateX = useSharedValue(0);
  const hiddenRotationX = screenWidth * 2;
  const rotate = useDerivedValue(
    () => interpolate(translateX.value, [0, hiddenRotationX], [0, 60]) + 'deg',
  );
  const cardStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
        {
          rotate: rotate.value,
        },
      ],
    };
  });
  const panGesterEvent = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.translateX = translateX.value;
    },
    onActive: (event, context) => {
      translateX.value = event.translationX + context.translateX;
      console.log('Active --->', event.translationX + context.translateX);
    },
    onEnd: () => {
      translateX.value = withSpring(0);
      console.log(translateX.value);
    },
  });
  console.log(users);
  return (
    // <GestureHandlerRootView>
    <View style={styles.container}>
      <View style={styles.nextCardContainer}>
        <Card user={users[2]} />
      </View>
      <PanGestureHandler onGestureEvent={panGesterEvent}>
        <Animated.View style={[styles.animatedView, cardStyle]}>
          <Card user={users[3]} />
        </Animated.View>
      </PanGestureHandler>
      {/* <Button
        title="click"
        onPress={() => (translateX.value = withSpring(Math.random()))}
      /> */}
    </View>
    // </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animatedView: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextCardContainer: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
