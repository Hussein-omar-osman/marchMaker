import React from 'react';
import {Image, ImageBackground, StyleSheet, Text, View} from 'react-native';

import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Card from './src/components/Card';

const App = () => {
  return (
    // <GestureHandlerRootView>
    <View style={styles.container}>
      <Card />
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
});

export default App;
