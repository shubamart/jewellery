import React, {useState, useEffect} from "react";
import {useSelector, useDispatch } from 'react-redux'
import {View, Text, Image, StatusBar, TouchableOpacity, Platform, Dimensions, ActivityIndicator} from "react-native";
import styles from "./styles";
import Feather from 'react-native-vector-icons/Feather';
import { Colors } from "../../theme/colors";
import imagePaths from "../../utilities/imagePaths";
import {user} from "../../redux/features/userReducer";
import StatusBarHeight, {getStatusBarHeight} from 'react-native-status-bar-height';
import Config from "../../config";
import { BackLongArrowIcon, MenuBlackIcon } from "../../assets";

const Header = ({navigation, backIcon, sidetitle, title, centerLogo, rightIcon, searchBar, cancelbtn, drawerIcon, routeParam}) => {
  const dispatch = useDispatch()
  const [profileUrl, setProfileUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <>
    <StatusBar hidden={false} />
    <View style={[styles.headerWrapper, {
      paddingTop:Platform.OS === "ios" ? getStatusBarHeight() :0
    }]}>
     
      <View style={styles.header}>
          <View style={styles.headerRow}>
              {backIcon ?
                <TouchableOpacity style={{marginTop:0}}
                  onPress={() => navigation.goBack()} >
                  <BackLongArrowIcon/>
                </TouchableOpacity>
              
              :
                <View style={[styles.headerLeft]}>
                  <TouchableOpacity 
                    onPress={() => navigation.toggleDrawer()}
                  >
                    <MenuBlackIcon/>
                  </TouchableOpacity>
                  
                  <Image
                    style={styles.appLogo}
                    source={imagePaths.homoLogo}
                  />
                </View>
              }

              {sidetitle &&
                <View>
                  {sidetitle}
                </View>
              }
            </View>

            {title &&
              <View style={[styles.headerRow, {marginLeft:10}]}>
                <Text style={[styles.welcomeUser]}>
                  {title}
                </Text>
              </View>
            }

            {centerLogo &&
              <View style={[styles.headerRow, {marginLeft:10, paddingTop:10}]}>
                <Image
                  style={styles.appLogo}
                  source={imagePaths.homoLogo}
                />
              </View>
            }
            
            {rightIcon &&
              <View style={styles.headerRight}>
                {rightIcon}
              </View>
            }

            {searchBar &&
              <View style={{width:'86%'}}>
                {searchBar}
              </View>
            }
      </View>
    </View>
    </>
  )
};

export default Header;
