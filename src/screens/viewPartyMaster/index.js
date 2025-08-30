import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Alert,
  ToastAndroid
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons'; 
import { dynamicSize, responsiveSize } from '../../utils/utils';
import { COLORS, FontFamily, Fonts } from '../../themes/variables';
import { BASE_URL } from '../../utils/config';
import AsyncStorage from "@react-native-async-storage/async-storage";
  

const ViewPartyMaster = () => {
    const navigation = useNavigation();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    const fetchEmployees = async () => {
      try {
        // 1. Get current logged-in user
        const jsonValue = await AsyncStorage.getItem("userData");
        const parsedUser = jsonValue ? JSON.parse(jsonValue) : null;
        setUser(parsedUser);
    
        // 2. Fetch data
        const response = await fetch(`${BASE_URL}list-party.php`);
        const result = await response.json();
        console.log("API response:", result);
    
        if (result.success && Array.isArray(result.data) && result.data.length > 0) {
          // 3. Filter by logged-in user
          const filteredData = result.data.filter(
            (item) => item.username === parsedUser?.wusername
          );
    
          // 4. Reverse to show newest first
          setEmployees(filteredData.reverse());
        } else {
          console.warn("No employees found or API returned invalid format");
        }
      } catch (error) {
        console.error("API Error:", error);
      } finally {
        setLoading(false);
      }
    };
    
    useEffect(() => {
        fetchEmployees(); // Call API on component mount
    }, []);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('EditPartyMaster', { profile: item })}
        >
            {/* <Image
                source={{ uri: 'https://randomuser.me/api/portraits/women/12.jpg' }}
                style={styles.image}
            /> */}

            <View style={{ flex: 1 }}>
              <View>
                <Text style={styles.name}>Name: {item.aname}</Text>
              </View>
                
              <View>
                <Text style={styles.name}>Mobile No: {item.amobile}</Text>
              </View>
                
              <View>
                <Text style={styles.name}>Created By: {item.username}</Text>
              </View>
                
            </View>

        {/* Prevents propagation of press to outer TouchableOpacity */}
            <TouchableOpacity
                style={styles.iconButton}
                onPress={() => navigation.navigate('EditPartyMaster', { profile: item })}
                onPressIn={(e) => e.stopPropagation()} 
            >
                <Ionicons name="create-outline" size={22} color="#4a90e2" />
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => handleDelete(item.acode, item?.aname)}
                style={styles.iconButton}
                onPressIn={(e) => e.stopPropagation()}
            >
                <Ionicons name="trash-outline" size={22} color="#d9534f" />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    const handleDelete = async (acode, aname) => {
        Alert.alert(
          'Delete User',
          `Are you sure you want to delete this ${aname}?`, 
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: async () => {
                try {
                  // Send DELETE request to the server
                  const response = await fetch(`${BASE_URL}delete-party.php`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ acode }),
                  });
      
                  const data = await response.json();
                  console.log("data issue", data)
                  if (data.success) {
                    // If the deletion is successful, remove the user from the list
                    setEmployees((prevEmployees) =>
                      prevEmployees.filter((employee) => employee.acode !== acode)
                    );
                    ToastAndroid.show(data?.message, ToastAndroid.SHORT);
                  } else {
                    ToastAndroid.show('Failed to delete party master.', ToastAndroid.SHORT);
                  }
                } catch (error) {
                  console.error('API Error:', error);
                  ToastAndroid.show('An error occurred. Please try again.', ToastAndroid.SHORT);
                }
              },
            },
          ],
          { cancelable: true }
        );
    };

    // console.log("employees", employees)

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <View>
          <Text style={styles.headerTitle}>Party Master List</Text>
        </View>
       
        <View style={{ width: 24 }} /> 
      </View>

      {/* List */}
      {loading ? (
        <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        </View>
       ) : employees.length === 0 ? (
        <View style={{ flex: 1,alignItems: "center", paddingTop:40 }}>
          <Text style={{ fontSize: 16, color: "#666" }}>No records found!</Text>
        </View>
      ) : (
        <FlatList
          data={employees}
          renderItem={renderItem}
          keyExtractor={(item) => item.acode.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
    )}
    </View>
  );
};

export default ViewPartyMaster;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: dynamicSize(1, true),
    paddingTop:Platform.OS == "ios" ?  10 :50
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: responsiveSize(5),
    fontFamily: Platform?.OS =="ios"  ? FontFamily.FSemiBold : Fonts.FSemiBold,
    color: '#222',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f6f6f6',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  image: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: 16,
  },
  name: {
    fontSize: responsiveSize(4),
    fontFamily: Platform?.OS =="ios"  ? FontFamily.FMedium : Fonts.FMedium,
    color: '#333',
    textTransform:"capitalize"
  },
  iconButton: {
    marginLeft: 20,
  },
});
