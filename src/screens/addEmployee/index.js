import React, { useMemo, useState } from 'react'
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
import { BASE_URL } from '../../utils/config';


const AddEmployee = (props) => {
    const [loading, setLoading] = useState(false);
    const radioButtons = useMemo(() => ([
        {
            id: '1', // acts as primary key, should be unique and non-empty string
            label: 'Male',
            value: 'male'
        },
        {
            id: '2',
            label: 'Female',
            value: 'female'
        }
    ]), []);

    const [isMembersFocus, setIsMembersFocus] = useState(false);
    const [selectedPolicyType, setSelectedPolicyType] = useState('Select');
    const membersData = [
        { label: 'User', value: 'USER' },
        { label: 'Admin', value: 'SUPERUSER' }
    ];

    const handleMemberSelectedChange = (item:any) => {
        setSelectedPolicyType(item?.value);
        setIsMembersFocus(false);
    };

    const validationSchema = Yup.object().shape({
        wusername: Yup.string()
          .required('Username is required')
          .test(
            'is-email-or-username',
            'Must be a valid email or username',
            value => {
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
              return emailRegex.test(value) || usernameRegex.test(value);
            }
        ),
        wpassword: Yup.string()
          .required('Password is required'),
        // gender: Yup.string().required('Gender is required'),
        // location: Yup.string().required('Location is required'),
        wusertype: Yup.string().required('Please select a user type'),
    });

    const submitFormData = async (formData, resetForm) => {
        setLoading(true);
        console.log("formData", formData)
        try {
            const response = await fetch(`${BASE_URL}add_person.php`, {
            // const response = await fetch('http://192.168.1.6/inventory/backend/add_person.php', {
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
                ToastAndroid.show('Employee added successfully', ToastAndroid.SHORT);
                // Alert.alert("Record added successfully");
                // resetForm(); 
                setLoading(false);
                props.navigation.navigate("EmployeeList");

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
            wusername: '',
            wpassword: '',
            // gender: '',
            // location: '',
            wusertype: '',
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
                                <Text style={styles.headerTitle}>Add User</Text>
                            </View>
                            <View style={{ width: 24 }} /> 
                        </View>

                        <View style={[Layout.column.flexDirection, MARGIN_T_SMALL]}>
                            <View style={[MARGIN_V_MEDIUM]}>
                                <CText type='labelsm'>
                                    Username *
                                </CText>
                            </View>
                            
                            <InputComp
                                placeholder="Username"
                                style={styles.input}
                                value={values.wusername}
                                onChangeText={handleChange('wusername')}
                                onBlur={handleBlur('wusername')}
                            />

                            {touched.wusername && errors.wusername && (
                                <View>
                                    <Text style={styles.errorText}>{errors.wusername}</Text>
                                </View>
                            )}

                            <View style={[MARGIN_V_LARGE]}>
                                <CText type='labelsm'>
                                    Password *
                                </CText>
                            </View>
                            
                            <InputComp
                                placeholder="Password"
                                style={styles.input}
                                value={values.wpassword}
                                onChangeText={handleChange('wpassword')}
                                onBlur={handleBlur('wpassword')}
                                secureTextEntry={true}
                            />

                            {touched.wpassword && errors.wpassword && (
                                <View>
                                    <Text style={styles.errorText}>{errors.wpassword}</Text>
                                </View>
                            )}

                            {/* <View style={[MARGIN_V_LARGE]}>
                                <CText type='labelsm'>
                                    Gender *
                                </CText>
                            </View>
                            
                            <RadioGroup
                                radioButtons={radioButtons}
                                onPress={(id) => setFieldValue('gender', id)}
                                selectedId={values.gender}
                                layout="row"
                            />

                            {touched.gender && errors.gender && (
                                <Text type='labelsm' style={styles.errorText}>{errors.gender}</Text>
                            )} */}

                            {/* <View style={[MARGIN_V_LARGE]}>
                                <CText type='labelsm'>
                                    Location *
                                </CText>
                            </View>
                            
                            <InputComp
                                placeholder="Location"
                                style={styles.input}
                                value={values.location}
                                onChangeText={handleChange('location')}
                                onBlur={handleBlur('location')}
                            />

                            {touched.location && errors.location && (
                                <Text type='labelsm' style={styles.errorText}>{errors.location}</Text>
                            )} */}

                            <View style={[MARGIN_V_LARGE]}>
                                <CText type='labelsm'>
                                    User Type *
                                </CText>
                            </View>

                            <Dropdown
                                style={[
                                styles.dropdown,
                                isMembersFocus && { borderColor: COLORS.GREY },
                                ]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                data={membersData}
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder={!isMembersFocus ? "Select" : "..."}
                                searchPlaceholder="Search..."
                                value={values.wusertype}
                                onChange={(item) => setFieldValue('wusertype', item.value)}
                                onFocus={() => setIsMembersFocus(true)}
                                onBlur={() => setIsMembersFocus(false)}
                                renderRightIcon={() => (
                                    <View style={styles.iconStyle}>
                                        <MaterialIcons
                                            name="keyboard-arrow-down"
                                            size={24}
                                            color={COLORS.GREY}
                                        />
                                    </View>
                                )}
                                closeModalWhenSelectedItem={true}
                            />

                            {touched.wusertype && errors.wusertype && (
                                <View>  
                                    <Text style={styles.errorText}>{errors.wusertype}</Text>
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
export default AddEmployee
