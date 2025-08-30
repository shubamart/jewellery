// NotFoundScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NotFound = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>404 - Page Not Found</Text>
    </View>
  );
};

export default NotFound;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
    color: '#999',
  },
});
