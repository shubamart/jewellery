import React, { useMemo, useState } from 'react'
import {View, KeyboardAvoidingView, StatusBar, Text, ScrollView, Alert,} from 'react-native'
import styles from './style'
import {Layout, MARGIN_T_SMALL, MARGIN_V_LARGE, COLORS, MARGIN_V_MEDIUM } from '../../themes/variables';
import { CText } from '../../components/common/text/textComp';
import { InputComp } from '../../components/common/input/input';
import { ButtonComp } from '../../components/common/button/button';
import { Formik } from 'formik';
import * as Yup from 'yup';


const Register = (props) => {
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
        console.log("formData", formData);
        
        // props.navigation.navigate("Welcome");
    };
  return (
    <Formik
        initialValues={{
            name: '',
            password: ''
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

                        <CText type='md'>
                            Welcome to Inventory!
                        </CText>

                        <View style={[MARGIN_V_LARGE]}>
                            <CText type='sm'>
                                Kindly register to proceed further..!
                            </CText>
                        </View>

                        <View style={[Layout.column.flexDirection, MARGIN_T_SMALL]}>

                            <View style={[MARGIN_V_MEDIUM]}>
                                <CText type='labelsm'>
                                    Full Name *
                                </CText>
                            </View>
                            
                            <InputComp
                                placeholder="Fullname"
                                style={styles.input}
                                value={values.name}
                                onChangeText={handleChange('name')}
                                onBlur={handleBlur('name')}
                            />

                            {touched.name && errors.name && (
                                <Text type='labelsm' style={styles.errorText}>{errors.name}</Text>
                            )}

                            <View style={[MARGIN_V_MEDIUM]}>
                                <CText type='labelsm'>
                                    Username*
                                </CText>
                            </View>
                            
                            <InputComp
                                placeholder="username"
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
                                placeholder="password"
                                style={styles.input}
                                value={values.age}
                                onChangeText={handleChange('password')}
                                onBlur={handleBlur('password')}
                                secureTextEntry={true}
                                // keyboardType="numeric"
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
export default Register
