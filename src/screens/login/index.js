import React, { useMemo, useState } from 'react'
import {View, KeyboardAvoidingView, StatusBar, Text, ScrollView, Alert,} from 'react-native'
import styles from './style'
import {Layout, MARGIN_T_SMALL, MARGIN_V_LARGE, COLORS, MARGIN_V_MEDIUM } from '../../themes/variables';
import { CText } from '../../components/common/text/textComp';
import { InputComp } from '../../components/common/input/input';
import { ButtonComp } from '../../components/common/button/button';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../utils/config';
import RNRestart from 'react-native-restart';


const Login = (props) => {
    const validationSchema = Yup.object().shape({
        name: Yup.string()
          .required('Email or Username is required')
          .test(
            'is-email-or-username',
            'Must be a valid email or username',
            value => {
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
              return emailRegex.test(value) || usernameRegex.test(value);
            }
          ),
        password: Yup.string()
          .required('Password is required')
        //   .min(6, 'Password must be at least 6 characters')
        //   .matches(/[A-Z]/, 'Password must contain an uppercase letter')
        //   .matches(/[0-9]/, 'Password must contain a number'),
    });

    const submitFormData = async (formData, resetForm) => {
        try {
            const response = await fetch(`${BASE_URL}login.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    wusername: formData.name,
                    wpassword: formData.password,
                }),
            });

            const text = await response.text(); // <-- use text first
            console.log('Raw response:', text);

            const result = JSON.parse(text); // Then parse it
           
    
            // const result = await response.json();
            console.log('Login result:', result);
    
            if (result.success) {
                await AsyncStorage.setItem('userData', JSON.stringify(result.user));
                console.log('User data saved to local storage.');
                // Alert.alert('Success', `Welcome ${result.user.wusername}!`);
                // Optionally navigate:
                RNRestart.Restart();  // 🚀 restart app so Navigation picks AuthDashboard
                // props.navigation.navigate("Welcome");
            } else {
                Alert.alert('Login Failed', result.error || 'Invalid credentials');
            }
        } catch (error) {
            console.error('Login Error:', error);
            Alert.alert('Error', 'Something went wrong. Please try again later.');
        }
    };
    

    // const submitFormData = async (formData, resetForm) => {
    //     console.log("formData", formData);
    //     let data ={
    //     }
    //     // props.navigation.navigate("Welcome");
    // };
  return (
    <Formik
        initialValues={{
            name: '',
            password: ''
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
            submitFormData(values, resetForm);
            // setSubmitting(false);
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

                        <CText type='md'>
                            Welcome to Invenza!
                        </CText>

                        <View style={[MARGIN_V_LARGE]}>
                            <CText type='sm'>
                                Kindly login to proceed further..!
                            </CText>
                        </View>

                        <View style={[Layout.column.flexDirection, MARGIN_T_SMALL]}>
                            <View style={[MARGIN_V_MEDIUM]}>
                                <CText type='labelsm'>
                                    Email/Username *
                                </CText>
                            </View>
                            
                            <InputComp
                                placeholder="Name"
                                style={styles.input}
                                value={values.name}
                                onChangeText={handleChange('name')}
                                onBlur={handleBlur('name')}
                            />

                            {touched.name && errors.name && (
                                <Text type='labelsm' style={styles.errorText}>{errors.name}</Text>
                            )}

                            <View style={[MARGIN_V_LARGE]}>
                                <CText type='labelsm'>
                                    Password *
                                </CText>
                            </View>
                            
                            <InputComp
                                placeholder="Password"
                                style={styles.input}
                                value={values.password}
                                onChangeText={handleChange('password')}
                                onBlur={handleBlur('password')}
                                secureTextEntry={true}
                            />

                            {touched.password && errors.password && (
                                <Text type='labelsm' style={styles.errorText}>{errors.password}</Text>
                            )}

                            <View style={[MARGIN_V_LARGE, MARGIN_T_SMALL]}>
                                <ButtonComp onPress={handleSubmit}>
                                    <CText type='tiny'>Login</CText>
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
export default Login
