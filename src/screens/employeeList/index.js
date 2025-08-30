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
import Ionicons from 'react-native-vector-icons/Ionicons'; // or use react-native-vector-icons
import { dynamicSize, responsiveSize } from '../../utils/utils';
import { COLORS, FontFamily, Fonts } from '../../themes/variables';
import { BASE_URL } from '../../utils/config';

const employeeData = [
    {
      id: '1',
      name: 'Aarav Kapoor',
      image: 'https://randomuser.me/api/portraits/men/11.jpg',
    },
    {
      id: '2',
      name: 'Meera Verma',
      image: 'https://randomuser.me/api/portraits/women/12.jpg',
    },
    {
      id: '3',
      name: 'Raj Malhotra',
      image: 'https://randomuser.me/api/portraits/men/13.jpg',
    },
    {
      id: '4',
      name: 'Ananya Gupta',
      image: 'https://randomuser.me/api/portraits/women/14.jpg',
    },
    {
      id: '5',
      name: 'Dev Sharma',
      image: 'https://randomuser.me/api/portraits/men/15.jpg',
    },
    {
      id: '6',
      name: 'Riya Desai',
      image: 'https://randomuser.me/api/portraits/women/16.jpg',
    },
    {
      id: '7',
      name: 'Kabir Joshi',
      image: 'https://randomuser.me/api/portraits/men/17.jpg',
    },
    {
      id: '8',
      name: 'Isha Mehta',
      image: 'https://randomuser.me/api/portraits/women/18.jpg',
    },
    {
      id: '9',
      name: 'Arjun Singh',
      image: 'https://randomuser.me/api/portraits/men/19.jpg',
    },
    {
      id: '10',
      name: 'Sneha Reddy',
      image: 'https://randomuser.me/api/portraits/women/20.jpg',
    },
  ];
  

const EmployeeScreen = () => {
    const navigation = useNavigation();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchEmployees = async () => {
      try {
        const response = await fetch(`${BASE_URL}get_user_list.php`);
        const data = await response.json();
        console.log("response", data);
        
        if (Array.isArray(data?.data) && data?.data?.length > 0) {
          // ✅ Filter out SUPERADMIN and reverse to show newest first
          const filteredData = data.data
            .filter(item => item?.wusertype !== "SUPERADMIN")
            .reverse();
    
          setEmployees(filteredData);
        } else {
          console.warn('Failed to load data');
        }
      } catch (error) {
        console.error('API Error:', error);
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
            // onPress={() => navigation.navigate('ProfileDetails', { profile: item })}
        >
            <Image
              source={{ uri: 'https://randomuser.me/api/portraits/women/12.jpg' }}
              style={styles.image}
            />

            <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.wusername}</Text>
            </View>

        {/* Prevents propagation of press to outer TouchableOpacity */}
            {/* <TouchableOpacity
                style={styles.iconButton}
                onPress={() => navigation.navigate('ProfileDetails', { profile: item })}
                onPressIn={(e) => e.stopPropagation()} 
            >
                <Ionicons name="eye-outline" size={22} color="#4a90e2" />
            </TouchableOpacity> */}

            <TouchableOpacity
                onPress={() => handleDelete(item.id, item?.wusername)}
                style={styles.iconButton}
                onPressIn={(e) => e.stopPropagation()}
            >
                <Ionicons name="trash-outline" size={22} color="#d9534f" />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    const handleDelete = async (id, wusername) => {
      Alert.alert(
        'Delete User',
        `Are you sure you want to delete ${wusername}?`, // ✅ fixed template literal
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              try {
                const response = await fetch(`${BASE_URL}delete_user.php`, { // ✅ correct filename + backticks
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ id }), // ✅ matches PHP API
                });
    
                const data = await response.json();
                console.log("Delete response:", data);
    
                if (data.success) {
                  setEmployees((prev) => prev.filter((emp) => emp.id !== id));
                  ToastAndroid.show(data?.message || 'User deleted.', ToastAndroid.SHORT);
                } else {
                  ToastAndroid.show(data?.error || 'Failed to delete user.', ToastAndroid.SHORT);
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <View>
          <Text style={styles.headerTitle}>User list</Text>
        </View>

        <View style={{ width: 24 }} />
      </View>

      {/* List */}
      {loading ? (
        <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        </View>
      ) : employees.length === 0 ? (
        <View style={{ flex: 1, alignItems: "center", paddingTop:40 }}>
          <Text style={{ fontSize: 16, color: "#666" }}>Users not found!</Text>
        </View>
      ) : (
        <FlatList
          data={employees.filter(item => item?.wusertype !== "SUPERADMIN")}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default EmployeeScreen;

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
    textTransform: "capitalize"
  },
  iconButton: {
    marginLeft: 20,
  },
});
