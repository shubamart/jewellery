import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
    View,
    KeyboardAvoidingView,
    StatusBar,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    Platform,
    ActivityIndicator,
    Alert,
    Modal
} from 'react-native';
import styles from './style';
import { MARGIN_V_LARGE, COLORS } from '../../themes/variables';
import { CText } from '../../components/common/text/textComp';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { responsiveSize } from '../../utils/utils';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';


const Welcome = (props) => {
    const navigation = useNavigation();
    const stateRoutes = navigation.getState().routeNames;
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false); 
    const [voucherModal, setVoucherModal] = useState(false);
    console.log("user", user)

    const handleLogout = () => {
        Alert.alert(
          "Logout",
          "Are you sure you want to logout?",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Logout",
              style: "destructive",
              onPress: async () => {
                await AsyncStorage.removeItem("userData");
                // setUser(null);
                RNRestart.Restart();
                // Or use navigation.reset if you don’t want to restart app
              },
            },
          ],
          { cancelable: true }
        );
    };
   

    useFocusEffect(
        useCallback(() => {
          const loadUser = async () => {
            try {
                setLoading(true)
              const jsonValue = await AsyncStorage.getItem("userData");
              if (jsonValue) {
                const parsedUser = JSON.parse(jsonValue);
                setUser(parsedUser);
                console.log("User refreshed:", parsedUser);
              } else {
                setUser(null);
              }
            } catch (e) {
              console.error("Error reading user data:", e);
            } finally {
              setLoading(false);
            }
          };
      
          loadUser();
        }, [])
    );

    const safeNavigate = (routeName) => {
        if (stateRoutes.includes(routeName)) {
            navigation.navigate(routeName);
        } else {
            navigation.navigate('NotFound');
        }
    };

    const gridItems = [
        { id: '1', title: 'Add User', icon: 'person-add-outline', route: 'AddEmployee' },
        { id: '2', title: 'View Users', icon: 'people-outline', route: 'EmployeeList' },
        { id: '3', title: 'Add Party Master', icon: 'people-circle-outline', route: 'CreatePartyMaster' },
        { id: '4', title: 'View Party Master', icon: 'albums-outline', route: 'ViewPartyMaster' },
        { id: '5', title: 'Add Item', icon: 'add-circle-outline', route: 'AddItem' },
        { id: '6', title: 'View Items', icon: 'list-outline', route: 'ViewItems' },
        { id: '7', title: 'Jewellery Voucher', icon: 'diamond-outline', route: 'VoucherOptions' }, // 🔥 fake route for modal
        { id: '8', title: 'Statement', icon: 'document-text-outline', route: 'Statement' },
    ];


    const userItems = [
        { id: '1', title: 'Add Party Master', icon: 'people-circle-outline', route: 'CreatePartyMaster' },
        { id: '2', title: 'View Party Master', icon: 'albums-outline', route: 'ViewPartyMaster' },
    ];

    // 🟢 Show loading until user is fetched
    if (loading) {
        return (
            <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
                <ActivityIndicator size="large" color={COLORS.PRIMARY} />
                <Text style={{ marginTop:10 }}>Loading...</Text>
            </View>
        );
    }

   

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
        >
            <ScrollView
                // contentContainerStyle={{ flex: 1 }}
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 30  }}
                
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                 <View style={styles.container}>
                    <StatusBar
                        barStyle="dark-content"
                        backgroundColor={COLORS.WHITE}
                        translucent={false}
                    />

                    <View style={styles.header}>
                        <View style={{flex:1, flexDirection:"row"}}>
                            <TouchableOpacity>
                                <Ionicons name="menu" size={28} color="#000" />
                            </TouchableOpacity>
                        {/* <Image
                            source={require('../../assets/images/logo.png')} // update path if needed
                            style={{ width: 100, height: 100, marginBottom: 30 }}
                            resizeMode="contain"
                        /> */}
                       
                            {/* <Text style={[styles.headerTitle, {marginLeft:7}]}>Hi admin! </Text> */}
                            {user ? (
                                <View>
                                    <Text style={[styles.headerTitle, {marginLeft:7}]}>Welcome {user.wusername}!</Text>
                                </View>
                            ) : (
                                <View>
                                    <Text>Loading...</Text>
                                </View>
                            )}
                        </View>
                       
                        <TouchableOpacity onPress={handleLogout}>
                            <Text style={styles.headerTitle}>Logout</Text>
                        </TouchableOpacity>
                        
                        {/* <View style={{ width: 24 }} />  */}
                    </View>

                    {/* Logo */}
                    <Image
                        source={require('../../assets/images/logo.png')} // update path if needed
                        style={{ width: 100, height: 100, marginBottom: 30 }}
                        resizeMode="contain"
                    />

                    {/* Welcome Text */}
                    <CText type='md' style={{ textAlign: 'center', marginBottom: 10 }}>
                        Welcome to Invenza!
                    </CText>

                    <CText type='sm' style={{ textAlign: 'center', marginBottom: 30 }}>
                        Welcome to Invenza dashboard panel
                    </CText>
                   
                    <View style={styles.grid}>
                        <>
                        {user?.wusertype == "SUPERADMIN" && (
                            <>
                            {(user?.wusertype === "SUPERADMIN" ? gridItems : userItems).map((item) => (
                                <TouchableOpacity
                                key={item.id}
                                style={styles.card}
                                onPress={() => {
                                    if (item.route === "VoucherOptions") {
                                        setVoucherModal(true); // 🔥 open modal instead of direct nav
                                    } else {
                                        safeNavigate(item.route)
                                    }
                                }}
                                // onPress={() => safeNavigate(item.route)}
                                >
                                <Ionicons name={item.icon} size={30} color={COLORS.PRIMARY} />
                                <View>
                                    <Text style={styles.title}>{item.title}</Text>
                                </View>
                                </TouchableOpacity>
                            ))}
                            </>
                        )}

                        {user?.wusertype == "USER" && (
                            <>
                            {(user?.wusertype === "USER" ? userItems : gridItems).map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={styles.card}
                                    onPress={() => safeNavigate(item.route)}
                                >
                                    <Ionicons name={item.icon} size={30} color={COLORS.PRIMARY} />
                                    <View>
                                        <Text style={styles.title}>{item.title}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                            </>
                        )}
                        </>
                    </View>
                
                </View>
            </ScrollView>

            {/* 🔥 Voucher Options Modal */}
            <Modal
                visible={voucherModal}
                transparent
                animationType="slide"
                onRequestClose={() => setVoucherModal(false)}
            >
                <View style={{ flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'rgba(0,0,0,0.5)' }}>
                    <View style={{ width:'80%', backgroundColor:'#fff', borderRadius:10, padding:20 }}>
                        <Text style={{ fontSize:18, fontWeight:'bold', marginBottom:20 }}>Choose Voucher</Text>

                        <TouchableOpacity
                            style={{ padding:15, backgroundColor:COLORS.PRIMARY, borderRadius:8, marginBottom:10 }}
                            onPress={() => {
                                setVoucherModal(false);
                                safeNavigate("AddIssueVoucher");
                            }}
                        >
                            <Text style={{ color:'#fff', textAlign:'center', fontSize:16 }}>Add Issue Voucher</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{ padding:15, backgroundColor:COLORS.PRIMARY, borderRadius:8, marginBottom:10 }}
                            onPress={() => {
                                setVoucherModal(false);
                                safeNavigate("AddRecieveVoucher");
                            }}
                        >
                            <Text style={{ color:'#fff', textAlign:'center', fontSize:16 }}>Add Receive Voucher</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{ padding:12, alignSelf:'center', marginTop:10 }}
                            onPress={() => setVoucherModal(false)}
                        >
                            <Text style={{ color:COLORS.RED, fontSize:15 }}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
};

export default Welcome;
