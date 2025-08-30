import React, {useEffect} from 'react'
import {View, Text, StatusBar} from 'react-native'
import imagePaths from '../../utils/imagePaths';
import ImageWrapper from '../../components/common/image/index';
import styles from './style'
import { COLORS, FontFamily } from '../../themes/variables';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Splash = ({navigation}) => {
    useEffect(() => {
        const checkUser = async () => {
          try {
            const jsonValue = await AsyncStorage.getItem('userData'); // 👈 use same key as Welcome.js
            setTimeout(() => {
              if (jsonValue) {
                navigation.replace("Welcome"); // user found → go to Welcome
              } else {
                navigation.replace("Login");   // user not found → go to Login
              }
            }, 2000);
          } catch (error) {
            console.error("Error checking user:", error);
            navigation.replace("Login");
          }
        };
    
        checkUser();
      }, [navigation]);
    return (
            <View style={styles.container}>
                <StatusBar
                    barStyle="light-content" // 'dark-content' or 'light-content'
                    backgroundColor={COLORS.PRIMARY} // Background color of the statu
                    translucent={false} // Whether the status bar is translucent
                />
                
                <ImageWrapper
                    imagePath={imagePaths.logo}
                    maxWidth={127} maxHeight={38}
                />
                <View style={styles.TextWrapper}>
                <Text style={{
                    color:COLORS.WHITE,
                    fontSize:20,
                    lineHeight:28,
                    fontFamily:FontFamily.FRegular
                }}>
                    Inventory in a single roof
                </Text>
                </View>
            </View>
    )
}
export default Splash
