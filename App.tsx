/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React from 'react';
import Navigation from './src/routes/navigation';
import {SafeAreaView} from 'react-native';
import { Layout } from './src/themes/variables';
import AsyncStorage from "@react-native-async-storage/async-storage";

function App() {
  return (
    <SafeAreaView style={[Layout.fill]}>
      <Navigation />
    </SafeAreaView>
  );
}

export default App;
