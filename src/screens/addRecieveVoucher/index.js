import React, { useMemo, useState, useEffect } from 'react'
import {View, KeyboardAvoidingView, StatusBar, Text, ScrollView, TouchableOpacity, ActivityIndicator,  ToastAndroid} from 'react-native'
import styles from './style'
import {Layout, MARGIN_T_SMALL, MARGIN_V_LARGE, COLORS, MARGIN_V_MEDIUM, FontFamily, Fonts } from '../../themes/variables';
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { responsiveSize } from '../../utils/utils';
import { CustomInputComp } from '../../components/common/customInput/index';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Colors } from 'react-native/Libraries/NewAppScreen';


const AddRecieveVoucher = (props) => {
    const [loading, setLoading] = useState(false);
    const [partyMaster, setPartyMaster] = useState([]);
    const [partyMasterLoading, setPartyMasterLoading] = useState(true);
    const [showPicker, setShowPicker] = useState(false);
    const [user, setUser] = useState(null);
    const [itemLoading, setItemLoading] = useState(false);
    const [jpItems, setJpItems] = useState([]);
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

    const [isPartyFocus, setIsPartyFocus] = useState(false);
    const [isParticulerFocus, setIsParticulerFocus] = useState(false);
    const [selectedPolicyType, setSelectedPolicyType] = useState('Select');
    const membersData = [
        { label: 'User', value: 'USER' },
        { label: 'Admin', value: 'SUPERUSER' }
    ];

  
  const today = new Date();
  // Save for DB
  const formatForDB = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${year}-${month}-${day}`; // YYYY-MM-DD
  };

  // Show in UI
    const formatForUI = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`; // DD-MM-YYYY
  };

  console.log("date today", today)

    const fetchPartyMasterList = async () => {
        try {
          // 1. Get current logged-in user
          const jsonValue = await AsyncStorage.getItem("userData");
          const parsedUser = jsonValue ? JSON.parse(jsonValue) : null;
          console.log("parsedUser", parsedUser)
          setUser(parsedUser);
      
          // 2. Fetch data
          const response = await fetch(`${BASE_URL}list-party.php`);
          const result = await response.json();
          console.log("API response:", result?.data);
      
          if (result.success && Array.isArray(result.data) && result.data.length > 0) {
            // 3. Filter by logged-in user
            const filteredData = result.data.filter(
              (item) => item.username === parsedUser?.wusername
            );
      
            // 4. Map into radio-button style
            const transformedData = filteredData.reverse().map((item, index) => ({
                id: item.acode.toString(), // unique string key
                label: item.aname,         // what user sees
                value: item.acode,         // can be acode or full object if needed
                // ...item                    // keep original properties (optional)
            }));

            setPartyMaster(transformedData);
          } else {
            console.warn("No partymaster found or API returned invalid format");
          }
        } catch (error) {
          console.error("API Error:", error);
        } finally {
          setPartyMasterLoading(false);
        }
    };

    const fetchItemsList = async () => {
        try {
          // 1. Get current logged-in user
          const jsonValue = await AsyncStorage.getItem("userData");
          const parsedUser = jsonValue ? JSON.parse(jsonValue) : null;
          setUser(parsedUser);
      
          // 2. Fetch data
          const response = await fetch(`${BASE_URL}jt-list.php`);
          const result = await response.json();
          console.log("API response item list:", result);
      
          if (result.success && Array.isArray(result.data) && result.data.length > 0) {
            // 3. Transform into label/value format
            const formattedData = result.data.map((item) => ({
              id: item.jtcode.toString(),
              label: item.jtname,
              value: item.jtcode.toString(),
            }));
      
            // 4. Reverse to show newest first
            setJpItems(formattedData.reverse());
          } else {
            console.warn("No item found or API returned invalid format");
          }
        } catch (error) {
          console.error("API Error:", error);
        } finally {
          setItemLoading(false);
        }
    };

    useEffect(() => {
        fetchPartyMasterList(); // Call API on component mount
        fetchItemsList(); 
    }, []);

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
        acode: Yup.string().required('Please select a party'),
        vdate: Yup.string()
            .required("Date is required")
            .test("is-valid", "Invalid date", (value) => {
                return !isNaN(Date.parse(value));
            })
            .test("not-future", "Date cannot be in the future", (value) => {
                if (!value) return false;
                return new Date(value) <= today;
            }),
        pid:Yup.string().required('Please select a product'),
        pname: Yup.string().required('Please select a product'),
        recgrosswt: Yup.number()
            .transform((value, originalValue) => {
                if (typeof originalValue === 'string') {
                const parsed = parseFloat(originalValue.replace(/,/g, ''));
                return isNaN(parsed) ? undefined : parsed;
                }
                return value;
            })
            .typeError("G Wt must be a number")
            .required("G Wt is required")
            .min(0, "G Wt cannot be negative"),

        recdwt: Yup.number()
            .transform((value, originalValue) => {
                if (typeof originalValue === 'string') {
                const parsed = parseFloat(originalValue.replace(/,/g, ''));
                return isNaN(parsed) ? undefined : parsed;
                }
                return value;
            })
            .typeError("D Wt must be a number")
            // .required("D Wt is required")
            .min(0, "D Wt cannot be negative"),

        recstwt: Yup.number()
            .transform((value, originalValue) => {
                if (typeof originalValue === 'string') {
                const parsed = parseFloat(originalValue.replace(/,/g, ''));
                return isNaN(parsed) ? undefined : parsed;
                }
                return value;
            })
            .typeError("St.Wt must be a number")
            // .required("St.Wt is required")
            .min(0, "St. Wt cannot be negative"),
            
        rectotalwt: Yup.number()
            .transform((value, originalValue) => {
                if (typeof originalValue === 'string') {
                const parsed = parseFloat(originalValue.replace(/,/g, ''));
                return isNaN(parsed) ? undefined : parsed;
                }
                return value;
            })
            .typeError("Total must be a number")
            // .required("Total is required")
            .min(0, "Total cannot be negative"),
        wastagerate: Yup.number()
            .typeError("Enter a valid percentage")
            // .required("Wastage is required")
            .min(0, "Wastage cannot be negative")
            .max(100, "Wastage cannot exceed 100%"),
            
        recwastage: Yup.number()
            .transform((value, originalValue) => {
                if (typeof originalValue === 'string') {
                const parsed = parseFloat(originalValue.replace(/,/g, ''));
                return isNaN(parsed) ? undefined : parsed;
                }
                return value;
            })
            .typeError("Gms. must be a number")
            // .required("Gms. is required")
            .min(0, "Gms. cannot be negative"),

        wpurity: Yup.string(),
            // .required('Purity is required'),

        remarks: Yup.string()
            // .required("Remarks are required")
            .max(500, "Remarks cannot exceed 500 characters"),
           
     });

    const submitFormData = async (formData, resetForm) => {
        setLoading(true);
        console.log("formData", formData)
        try {
            const response = await fetch(`${BASE_URL}add_recieve_voucher.php`, {
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
                ToastAndroid.show('Voucher added successfully', ToastAndroid.SHORT);
                // Alert.alert("Record added successfully");
                // resetForm(); 
                setLoading(false);
                props.navigation.navigate("Welcome");

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

    if (partyMasterLoading) {
        return (
          <View style={[styles.container, { justifyContent: "center", alignItems: "center", flex: 1 }]}>
            <ActivityIndicator size="large" color={COLORS.PRIMARY} />
            <Text style={{ marginTop: 10, color: COLORS.GREY }}>Loading...</Text>
          </View>
        );
    }
  return (
    <Formik
        initialValues={{
            wusername: '',
            acode: '',
            pid:"",
            pname:"",
            vdate: formatForDB(today), 
            recgrosswt: "",
            recdwt: "",
            recstwt: "",
            rectotalwt:"",
            status:"Credit",
            wastagerate: "",
            recwastage:"",
            wpurity:"",
            remarks:""
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
            setFieldTouched
        }) => (
            <KeyboardAwareScrollView
                enableOnAndroid={true}
                extraScrollHeight={80} // push content above keyboard
                keyboardOpeningTime={0}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
                // behavior={Platform.OS === "ios" ? "padding" : "undefined"}
                // style={{ flex: 1 }}
                // keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 50, backgroundColor:COLORS.WHITE }}
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
                            <TouchableOpacity onPress={() => props.navigation.goBack()}>
                                <Ionicons name="arrow-back" size={24} color="#333" />
                            </TouchableOpacity>
                            <View>
                                <Text style={styles.headerTitle}>Add Jewellery Recieve Voucher</Text>
                            </View>
                            <View style={{ width: 24 }} /> 
                        </View>

                        <View style={[Layout.column.flexDirection, MARGIN_T_SMALL]}>
                            <View style={[MARGIN_V_LARGE]}>
                                <CText type='labelsm'>
                                    Select Party *
                                </CText>
                            </View>

                            <Dropdown
                                style={[
                                styles.dropdown,
                                isPartyFocus && { borderColor: COLORS.GREY },
                                ]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                data={partyMaster}
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder={!isPartyFocus ? "Select Party" : "..."}
                                searchPlaceholder="Search..."
                                value={values.acode}
                                onChange={(item) => setFieldValue('acode', item.value)}
                                onFocus={() => setIsPartyFocus(true)}
                                onBlur={() => setIsPartyFocus(false)}
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

                            {touched.acode && errors.acode && (
                                <View>  
                                    <Text style={styles.errorText}>{errors.acode}</Text>
                                </View>
                            )}

                            <View style={[MARGIN_V_LARGE]}>
                                <CText type='labelsm'>
                                    Select Date * 
                                </CText>
                            </View>

                            {/* Readonly "input" that opens the picker */}
                            <TouchableOpacity
                                onPress={() => {
                                setFieldTouched("vdate", true);
                                setShowPicker(true);
                                }}
                                style={{
                                borderWidth: 1,
                                borderColor: touched.vdate && errors.vdate ? "#d9534f" : "#ccc",
                                borderRadius: 8,
                                paddingVertical: 12,
                                paddingHorizontal: 12,
                                backgroundColor: COLORS.WHITE,
                                fontSize: responsiveSize(4),
                                color: COLORS.BLACK,
                                borderRadius: 10,
                                paddingHorizontal: responsiveSize(2),
                                fontFamily:Platform.OS == "ios" ? FontFamily.FRegular :Fonts.FRegular,
                                borderColor:COLORS.GREY,
                                borderWidth:1,
                                paddingVertical:responsiveSize(4.6)
                                }}
                                activeOpacity={0.7}
                            >
                                <Text style={{ color: values.vdate ? "#111" : "#888",   fontSize: responsiveSize(4), fontFamily:Platform.OS == "ios" ? FontFamily.FRegular :Fonts.FRegular,}}>
                                    {values.vdate ? formatForUI(values.vdate) : "Select Date"}
                                </Text>
                            </TouchableOpacity>

                            {/* Error message */}
                            {touched.vdate && errors.vdate ? (
                                <View>
                                    <Text style={styles.errorText}>{errors.vdate}</Text>
                                </View>
                            ) : null}

                            {showPicker && (
                                <DateTimePicker
                                    value={values.vdate ? new Date(values.vdate) : today}
                                    mode="date"
                                    display="default"
                                    maximumDate={today}
                                    onChange={(event, date) => {
                                        setShowPicker(false);
                                        if (event.type === "set" && date) {
                                        setFieldValue("vdate", formatForDB(date)); // ✅ store YYYY-MM-DD string
                                        }
                                    }}
                                />
                            )}

                            <View style={[MARGIN_V_LARGE]}>
                                <CText type='labelsm'>
                                    Select Product *
                                </CText>
                            </View>

                            <Dropdown
                                style={[
                                styles.dropdown,
                                isParticulerFocus && { borderColor: COLORS.GREY },
                                ]}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                data={jpItems}
                                maxHeight={300}
                                labelField="label"
                                valueField="value"
                                placeholder={!isParticulerFocus ? "Select Product" : "..."}
                                searchPlaceholder="Search..."
                                value={values.pid}
                                onChange={(item) => {
                                    setFieldValue('pid', item.value);
                                    setFieldValue('pname', item.label);
                                }}
                                onFocus={() => setIsParticulerFocus(true)}
                                onBlur={() => setIsParticulerFocus(false)}
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

                            {touched.pid && errors.pid && (
                                <View>  
                                    <Text style={styles.errorText}>{errors.pid}</Text>
                                </View>
                            )}

                            <View style={[MARGIN_V_MEDIUM]}>
                                <CText type='labelsm'>
                                    G Wt. *
                                </CText>
                            </View>   

                            <CustomInputComp
                                placeholder="G Wt."
                                value={values.recgrosswt}
                                onChangeText={(t) => {
                                    setFieldValue('recgrosswt', t);
                                    const g = parseFloat(t) || 0;
                                    const d = parseFloat(values.recdwt) || 0;
                                    const s = parseFloat(values.recstwt) || 0;
                                    setFieldValue('rectotalwt', (g + d + s).toFixed(3));
                                    setFieldValue('wusername', user?.wusername);
                                }}
                                // onChangeText={(t) => setFieldValue('recgrosswt', t)}
                                onBlur={handleBlur('recgrosswt')}
                                formatOnBlur
                                keyboardType="numeric"
                            />

                            {touched.recgrosswt && errors.recgrosswt && (
                                <Text style={styles.errorText}>{errors.recgrosswt}</Text>
                            )}

                            <View style={[MARGIN_V_MEDIUM]}>
                                <CText type="labelsm">
                                    D Wt. *
                                </CText>
                            </View>

                            <CustomInputComp
                                placeholder="D Wt."
                                value={values.recdwt}
                                onChangeText={(t) => {
                                    setFieldValue('recdwt', t);
                                    const g = parseFloat(values.recgrosswt) || 0;
                                    const d = parseFloat(t) || 0;
                                    const s = parseFloat(values.recstwt) || 0;
                                    setFieldValue('rectotalwt', (g + d + s).toFixed(3));
                                }}
                                // onChangeText={(t) => setFieldValue('recdwt', t)}
                                onBlur={handleBlur('recdwt')}
                                formatOnBlur
                                keyboardType="numeric"
                            />

                            {touched.recdwt && errors.recdwt && (
                                <Text style={styles.errorText}>{errors.recdwt}</Text>
                            )}

                            <View style={[MARGIN_V_MEDIUM]}>
                                <CText type="labelsm">
                                    St. Wt. *
                                </CText>
                            </View>

                            <CustomInputComp
                                placeholder="St. Wt."
                                value={values.recstwt}
                                onChangeText={(t) => {
                                    setFieldValue('recstwt', t);
                                    const g = parseFloat(values.recgrosswt) || 0;
                                    const d = parseFloat(values.recdwt) || 0;
                                    const s = parseFloat(t) || 0;
                                    setFieldValue('rectotalwt', (g + d + s).toFixed(3));
                                }}
                                // onChangeText={(t) => setFieldValue('recstwt', t)}
                                onBlur={handleBlur('recstwt')}
                                formatOnBlur
                                keyboardType="numeric"
                            />

                            {touched.recstwt && errors.recstwt && (
                                <Text style={styles.errorText}>{errors.recstwt}</Text>
                            )}

                            <View style={[MARGIN_V_MEDIUM]}>
                                <CText type="labelsm">
                                    Total * 
                                </CText>
                            </View>

                            <CustomInputComp
                                placeholder="Total"
                                value={values.rectotalwt}
                                keyboardType="numeric"
                                editable={false} 
                            />

                            {touched.rectotalwt && errors.rectotalwt && (
                                <Text style={styles.errorText}>{errors.rectotalwt}</Text>
                            )}

                            <View style={[MARGIN_V_MEDIUM]}>
                                <CText type="labelsm">
                                    Wastage (%) *
                                </CText>
                            </View>

                            <InputComp
                                placeholder="Wastage (%)"
                                value={values.wastagerate}
                                onChangeText={(t) => {
                                    setFieldValue('wastagerate', t);

                                    const total = parseFloat(values.recgrosswt || 0) +
                                                parseFloat(values.recdwt || 0) +
                                                parseFloat(values.recstwt || 0);

                                    const rate = parseFloat(t) || 0;
                                    setFieldValue('recwastage', ((total * rate) / 100).toFixed(3));
                                }}
                                onBlur={() => {
                                    if (values.wastagerate !== "") {
                                        // setFieldValue('wastagerate', parseFloat(values.wastagerate).toFixed(2));
                                        setFieldValue('wastagerate', parseFloat(values.wastagerate));
                                    }
                                }}
                                keyboardType="numeric"
                            />

                            {touched.wastagerate && errors.wastagerate && (
                                <View>
                                    <Text style={styles.errorText}>{errors.wastagerate}</Text>
                                </View>
                            )}

                            <View style={[MARGIN_V_MEDIUM]}>
                                <CText type="labelsm">
                                    Gms. * 
                                </CText>
                            </View>

                            <CustomInputComp
                                placeholder="Gms."
                                value={values.recwastage}
                                // onChangeText={(t) => setFieldValue('recwastage', t)}
                                // onBlur={handleBlur('recwastage')}
                                // formatOnBlur
                                editable={false}
                                keyboardType="numeric"
                            />

                            {touched.recwastage && errors.recwastage && (
                                <View>
                                    <Text style={styles.errorText}>{errors.recwastage}</Text>
                                </View>
                            )}

                            <View style={[MARGIN_V_MEDIUM]}>
                                <CText type='labelsm'>
                                    Purity * 
                                </CText>
                            </View>
                            
                            <InputComp
                                placeholder="Purity"
                                style={styles.input}
                                value={values.wpurity}
                                onChangeText={handleChange('wpurity')}
                                onBlur={handleBlur('wpurity')}
                            />

                            {touched.wpurity && errors.wpurity && (
                                <View>
                                    <Text style={styles.errorText}>{errors.wpurity}</Text>
                                </View>
                            )}

                            <View style={[MARGIN_V_MEDIUM]}>
                                <CText type='labelsm'>
                                    Remarks * 
                                </CText>
                            </View>

                            <InputComp
                                placeholder="Enter Remarks"
                                value={values.remarks}
                                onChangeText={(text) => handleChange("remarks")(text.trimStart())} 
                                onBlur={() => {
                                    // 🔥 Trim completely when user leaves the field
                                    setFieldValue("remarks", values.remarks?.trim() || "");
                                    handleBlur("remarks")();
                                }}
                                multiLine={true}
                                numberOfLines={4}
                                textAlignVertical="top"
                            />

                            {touched.remarks && errors.remarks && (
                                <Text style={styles.errorText}>{errors.remarks}</Text>
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
            </KeyboardAwareScrollView>
        )}
    </Formik>
  )     
}
export default AddRecieveVoucher
