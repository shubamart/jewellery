import React, { useMemo, useState, useEffect } from 'react'
import {View, KeyboardAvoidingView, StatusBar, Text, ScrollView, TouchableOpacity, ActivityIndicator,  ToastAndroid} from 'react-native'
import styles from './style'
import {Layout, MARGIN_T_SMALL, MARGIN_V_LARGE, COLORS, MARGIN_V_MEDIUM } from '../../themes/variables';
import { CText } from '../../components/common/text/textComp';
import { InputComp } from '../../components/common/input/input';
import { ButtonComp } from '../../components/common/button/button';
import RadioGroup from 'react-native-radio-buttons-group';
import { Dropdown } from 'react-native-element-dropdown';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Formik } from 'formik';
import * as Yup from 'yup';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRoute } from '@react-navigation/native';
import { BASE_URL } from '../../utils/config';


const EditPartyMaster = (props) => {
    const route = useRoute();
    const { profile } = route.params || {};
    console.log("profile",profile)
    const [initialData, setInitialData] = useState(profile);
    const [loading, setLoading] = useState(false);

    const [isMembersFocus, setIsMembersFocus] = useState(false);
    const [selectedPolicyType, setSelectedPolicyType] = useState('Select');
    const membersData = [
        { label: 'User', value: 'USER' },
        { label: 'Admin', value: 'ADMIN' }
    ];

    useEffect(() => {
        if (profile) {
          console.log("Profile received:", profile);
          // you can set it into form values if needed
        }
      }, [profile]);

    const handleMemberSelectedChange = (item:any) => {
        setSelectedPolicyType(item?.value);
        setIsMembersFocus(false);
    };

    const validationSchema = Yup.object().shape({
        acode: Yup.string()
            .required('Id is required'),
        aname: Yup.string()
            .required('Name is required')
            .min(2, 'Name must be at least 2 characters'),
        amobile: Yup.string()
            .required('Mobile number is required')
            .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits'),
        username: Yup.string()
            .required('Username is required')
            .test(
                'is-email-or-username',
                'Must be a valid email or username',
            value => {
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
              return emailRegex.test(value) || usernameRegex.test(value);
            }
        )
    });

    const submitFormData = async (formData, resetForm) => {
        setLoading(true);
        console.log("formData", formData)
        try {
            const response = await fetch(`${BASE_URL}update-party.php`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                // add authorization token here if needed
              },
              body: JSON.stringify(formData),
            });
        
            const data = await response.json();
        
            if (response.ok) {
              console.log('Success:', data);
              if(data?.success){
                ToastAndroid.show(data?.message, ToastAndroid.SHORT);
                // Alert.alert("Record added successfully");
                // resetForm(); 
                setLoading(false);
                props.navigation.navigate("ViewPartyMaster");

              }else{
                ToastAndroid.show('Server failed', ToastAndroid.SHORT);
                setLoading(false);
              }
              // Navigate to next screen or show success message
            } else {
              console.error('API Error:', data.message || 'Something went wrong');
              setLoading(false);
            }
          } catch (error) {
            console.error('Network Error:', error);
            setLoading(false);
        }
    };
  return (
    <Formik
        initialValues={{
            acode:profile?.acode || '',
            aname: profile?.aname || '',
            amobile: profile?.amobile || '',
            username: profile?.username || ''
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
            submitFormData(values, resetForm);
            setSubmitting(false);
            // resetForm(); // optional, if you want to clear the form after submit
        }}
        >
        {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            setFieldValue,
        }) => (
            <KeyboardAvoidingView
                // behavior={Platform.OS === "ios" ? "padding" : "height"}
                behavior={Platform.OS === "ios" ? "padding" : "undefined"}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
                // style={[Layout.fill]}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 0 }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={true}
                >
                    <View style={styles.container}>
                        <StatusBar
                            barStyle="dark-content" 
                            backgroundColor={COLORS.WHITE} 
                            translucent={false} 
                        />

                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => props.navigation.goBack()}>
                                <Ionicons name="arrow-back" size={24} color="#333" />
                            </TouchableOpacity>
                            
                            <View>
                                <Text style={styles.headerTitle}>Update Party Master</Text>
                            </View>
                            <View style={{ width: 24 }} /> 
                        </View>

                        <View style={[Layout.column.flexDirection, MARGIN_T_SMALL]}>
                            <View style={[MARGIN_V_LARGE]}>
                                <CText type='labelsm'>
                                    Name *
                                </CText>
                            </View>

                            <InputComp
                                placeholder="Name"
                                style={styles.input}
                                value={values.aname}
                                onChangeText={handleChange('aname')}
                                onBlur={handleBlur('aname')}
                            />

                            {touched.aname && errors.aname && (
                                <View>
                                    <Text style={styles.errorText}>{errors.aname}</Text>
                                </View>
                            )}

                            <View style={[MARGIN_V_LARGE]}>
                                <CText type='labelsm'>
                                    Mobile Number *
                                </CText>
                            </View>
                            
                            <InputComp
                                placeholder="Mobile Number"
                                style={styles.input}
                                value={values.amobile}
                                onChangeText={handleChange('amobile')}
                                onBlur={handleBlur('amobile')}
                                keyboardType="number-pad"
                                maxLength={10}
                            />

                            {touched.amobile && errors.amobile && (
                                <View>
                                    <Text  style={styles.errorText}>{errors.amobile}</Text>
                                </View>
                            )}

                            <View style={[MARGIN_V_MEDIUM]}>
                                <CText type='labelsm'>
                                    Username *
                                </CText>
                            </View>
                            
                            <InputComp
                                placeholder="Username"
                                style={styles.input}
                                value={values.username}
                                onChangeText={handleChange('username')}
                                onBlur={handleBlur('username')}
                                editable={false} 
                            />

                            {touched.username && errors.username && (
                                <View>
                                    <Text style={styles.errorText}>{errors.username}</Text>
                                </View>
                            )}        

                            <View style={[MARGIN_V_LARGE, MARGIN_T_SMALL]}>
                                <ButtonComp onPress={handleSubmit}>
                                    {loading ? (
                                        <ActivityIndicator color="#fff" size="small" />
                                    ) : (
                                        <CText type='tiny'>Submit</CText>
                                    )}
                                </ButtonComp>
                            </View>
                        </View>
                                              
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        )}
    </Formik>
  )     
}
export default EditPartyMaster
