import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ProfileDetails = ({ route, navigation }) => {
  const profile = route?.params?.profile || {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (123) 456-7890',
    location: 'New York, USA',
    age: 30,
    gender: 'Male',
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={24}
          color="#000"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 24 }} /> {/* spacer */}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Picture */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/women/12.jpg' }} // or profile.image if dynamic
            style={styles.profileImage}
          />
        </View>

        {/* Basic Info */}
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.email}>{profile.email}</Text>

        {/* Details Card */}
        <View style={styles.card}>
          <Detail label=" Family Members" value={profile.members} />
          <Detail label="Location" value={profile.location} />
          <Detail label="Gender" value={profile.gender} />
          <Detail label="Age" value={`${profile.age}`} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const Detail = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ccc',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
  },
  email: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
  card: {
    width: '90%',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ProfileDetails;
