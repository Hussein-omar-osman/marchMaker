import 'react-native-gesture-handler';
import React from 'react';
import {
  Button,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  GestureHandlerRootView,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import Card from './src/components/Card';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const App = () => {
  const translateX = useSharedValue(0);
  const cardStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
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
  return (
    // <GestureHandlerRootView>
    <View style={styles.container}>
      <PanGestureHandler onGestureEvent={panGesterEvent}>
        <Animated.View style={[styles.animatedView, cardStyle]}>
          <Card />
        </Animated.View>
      </PanGestureHandler>
      <Button
        title="click"
        onPress={() => (translateX.value = withSpring(Math.random()))}
      />
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
    // height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
