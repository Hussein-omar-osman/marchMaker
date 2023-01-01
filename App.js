import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
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
  event,
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import users from './src/data/user.js';

const App = () => {
  const SWIPE_VELOCITY = 800;
  const {width: screenWidth} = useWindowDimensions();
  const [currIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(currIndex + 1);
  const profile = users[currIndex];
  const nextProfile = users[nextIndex];
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
  const nextCardStyle = useAnimatedStyle(() => {
    const commInter = num =>
      interpolate(
        translateX.value,
        [-hiddenRotationX, 0, hiddenRotationX],
        [1, num, 1],
      );
    return {
      transform: [
        {
          scale: commInter(0.8),
        },
      ],
      opacity: commInter(0.6),
    };
  });
  const panGesterEvent = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.translateX = translateX.value;
    },
    // eslint-disable-next-line no-shadow
    onActive: (event, context) => {
      translateX.value = event.translationX + context.translateX;
      console.log('Active --->', event.translationX + context.translateX);
    },
    // eslint-disable-next-line no-shadow
    onEnd: (event, _) => {
      console.log(translateX.value);
      if (Math.abs(event.velocityX) < SWIPE_VELOCITY) {
        translateX.value = withSpring(0);
        return;
      }
      translateX.value = withSpring(
        event.velocityX > 0 ? hiddenRotationX : -hiddenRotationX,
        {},
        () => runOnJS(setCurrentIndex)(currIndex + 1),
      );
    },
  });
  useEffect(() => {
    translateX.value = 0;
    setNextIndex(currIndex + 1);
  }, [currIndex, translateX]);
  return (
    // <GestureHandlerRootView style={styles.container}>
    <View style={styles.container}>
      {nextProfile && (
        <View style={styles.nextCardContainer}>
          <Animated.View style={[styles.animatedView, nextCardStyle]}>
            <Card user={nextProfile} />
          </Animated.View>
        </View>
      )}
      {profile && (
        <PanGestureHandler onGestureEvent={panGesterEvent}>
          <Animated.View style={[styles.animatedView, cardStyle]}>
            <Card user={profile} />
          </Animated.View>
        </PanGestureHandler>
      )}
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
