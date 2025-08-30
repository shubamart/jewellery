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
import { COLORS, FontFamily, Fonts, MARGIN_T_SMALL, MARGIN_V_LARGE } from '../../themes/variables';
import { BASE_URL } from '../../utils/config';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CText } from '../../components/common/text/textComp';
import { Dropdown } from 'react-native-element-dropdown';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ButtonComp } from '../../components/common/button/button';


  
// Format date for saving to DB (YYYY-MM-DD)
const formatForDB = (date) => {
    if (!date) return null;
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};
  
// Format date for UI (DD-MM-YYYY)
const formatForUI = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
};

const transactions = [
    { id: "1", day: "29", month: "AUG", details: "UPI/P2A/524139498533/", subDetails: "AMIT KUMA / AXIS BANK", type: "credit", amount: "137.00" },
    { id: "2", day: "29", month: "AUG", details: "UPI/P2M/560780015775/", subDetails: "Lal Babu", type: "debit", amount: "10.00" },
    { id: "3", day: "28", month: "AUG", details: "UPI/P2M/524025711796/", subDetails: "Lal Babu", type: "debit", amount: "10.00" },
    { id: "4", day: "27", month: "AUG", details: "ATM-CASH-AXIS/DPRH 333701/5411/270825/", subDetails: "Cash Withdrawal", type: "debit", amount: "2000.00" },
    { id: "5", day: "27", month: "AUG", details: "UPI/P2A/560525972595/", subDetails: "RAVINDER / Punjab Na", type: "credit", amount: "600.00" },
    { id: "6", day: "26", month: "AUG", details: "NEFT/AXISBANK/REF12345", subDetails: "Salary Credit", type: "credit", amount: "25000.00" },
    { id: "7", day: "26", month: "AUG", details: "UPI/P2M/879654321123/", subDetails: "BigBazaar Payment", type: "debit", amount: "1250.00" },
    { id: "8", day: "25", month: "AUG", details: "UPI/P2M/654987321456/", subDetails: "Swiggy Order", type: "debit", amount: "450.00" },
    { id: "9", day: "25", month: "AUG", details: "UPI/P2M/741258963147/", subDetails: "Amazon Pay", type: "debit", amount: "3200.00" },
    { id: "10", day: "24", month: "AUG", details: "IMPS/AXIS/9876543210", subDetails: "Fund Transfer", type: "credit", amount: "5000.00" },
    { id: "11", day: "24", month: "AUG", details: "UPI/P2M/951357456852/", subDetails: "Zomato Order", type: "debit", amount: "600.00" },
    { id: "12", day: "23", month: "AUG", details: "POS/123456/Flipkart", subDetails: "Shopping", type: "debit", amount: "2200.00" },
    { id: "13", day: "23", month: "AUG", details: "NEFT/HDFC/AXIS", subDetails: "Client Payment", type: "credit", amount: "10000.00" },
    { id: "14", day: "22", month: "AUG", details: "ATM-CASH/DELHI/AXIS", subDetails: "Cash Withdrawal", type: "debit", amount: "5000.00" },
    { id: "15", day: "22", month: "AUG", details: "UPI/P2A/875421369874/", subDetails: "Ramesh / ICICI", type: "credit", amount: "750.00" },
    { id: "16", day: "21", month: "AUG", details: "UPI/P2M/789456123012/", subDetails: "Uber Ride", type: "debit", amount: "220.00" },
    { id: "17", day: "21", month: "AUG", details: "UPI/P2M/654123789456/", subDetails: "Myntra", type: "debit", amount: "1800.00" },
    { id: "18", day: "20", month: "AUG", details: "NEFT/AXIS/CLIENT789", subDetails: "Project Payment", type: "credit", amount: "12000.00" },
    { id: "19", day: "20", month: "AUG", details: "UPI/P2M/123456987000/", subDetails: "Ola Cabs", type: "debit", amount: "350.00" },
    { id: "20", day: "19", month: "AUG", details: "IMPS/HDFC/11223344", subDetails: "Friend Transfer", type: "credit", amount: "2000.00" },
];
const Statement = () => {
    const navigation = useNavigation();
    const [jpItems, setJpItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [partyMaster, setPartyMaster] = useState([]);
    const [isPartyFocus, setIsPartyFocus] = useState(false);
    const [selectedParty, setSelectedParty] = useState(null);
    const [partyMasterLoading, setPartyMasterLoading] = useState(true);
    const [user, setUser] = useState(null);

    
    const [selectedFromDate, setSelectedFromDate] = useState(null);
    const [selectedToDate, setSelectedToDate] = useState(null);
    const [showFromPicker, setShowFromPicker] = useState(false);
    const [showToPicker, setShowToPicker] = useState(false);
    const [statementData, setStatementData] = useState(null);
    const today = new Date();

   

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

    const fetchItems = async () => {
        try {
            // 1. Get current logged-in user
            const jsonValue = await AsyncStorage.getItem("userData");
            const parsedUser = jsonValue ? JSON.parse(jsonValue) : null;
            setUser(parsedUser);
        
            // 2. Fetch data
            const response = await fetch(`${BASE_URL}jt-list.php`);
            const result = await response.json();
            console.log("API response:", result);
        
            if (result.success && Array.isArray(result.data) && result.data.length > 0) {
            // 3. Filter by logged-in user
            const filteredData = result.data;
        
            // 4. Reverse to show newest first
            setJpItems(filteredData.reverse());
            } else {
            console.warn("No item found or API returned invalid format");
            }
        } catch (error) {
            console.error("API Error:", error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchPartyMasterList(); 
        fetchItems();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.card}>
          {/* Date Section */}
            <View style={styles.dateBox}>
                <Text style={styles.dateDay}>{item.status == "Debit" ? "Dr." : "Cr."}</Text>
            </View>
        
            {/* Transaction Details */}
            <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.details}>{item.pname}</Text>
                <Text style={styles.subDetails}>{item.tdate}</Text>
            </View>
      
          {/* Amount with arrow */}
            <View style={styles.amountBox}>
                <MaterialIcons
                    name={item.status === "Credit" ? "arrow-downward" : "arrow-upward"}
                    size={20}
                    color={item.status === "Credit" ? "green" : "red"}
                />
                <Text
                    style={[
                    styles.amount,
                    { color: item.status === "Credit" ? "green" : "red" },
                    ]}
                >
                    ₹ {item.wtotalwt}
                </Text>
            </View>
        </View>
    );

    const handleSearch = async () => {
        if (!selectedParty || !selectedFromDate || !selectedToDate) {
          Alert.alert("Validation", "Please select Party, From Date, and To Date");
          return;
        }
       
        const url = `${BASE_URL}ledger-balance.php?acode=${selectedParty}&from_date=${selectedFromDate}&to_date=${selectedToDate}`;
        // const url = `http://work.bonlineinfotech.com/ledger-balance.php?acode=${selectedParty}&from_date=${selectedFromDate}&to_date=${selectedToDate}`;
    
        try {
          const response = await fetch(url);
          const data = await response.json();
          setStatementData(data)
          console.log("API Response aagya:", data);
        //   Alert.alert("Success", "Data fetched successfully!");
          // 👉 here you can set state and show results in FlatList
        } catch (error) {
          console.error("API Error:", error);
          Alert.alert("Error", "Failed to fetch data");
        }
    };


  return (
    <View style={styles.container}>
      {/* Header */}
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>

            <View>
            <Text style={styles.headerTitle}>Statement</Text>
            </View>
        
            <View style={{ width: 24 }} /> 
        </View>

        <View style={styles.filterContainer}>
            <View style={styles.partyContainer}>
                <TouchableOpacity
                    onPress={() => setShowFromPicker(true)}
                    style={{
                        borderWidth: 1,
                        borderColor: selectedFromDate ? COLORS.GREY : "#ccc",
                        borderRadius: 10,
                        paddingVertical: responsiveSize(4.6),
                        paddingHorizontal: responsiveSize(2),
                        backgroundColor: COLORS.WHITE,
                    }}
                    activeOpacity={0.7}
                >
                    <Text
                        style={{
                        color: selectedFromDate ? "#111" : "#888",
                        fontSize: responsiveSize(4),
                        fontFamily: Platform.OS === "ios" ? FontFamily.FRegular : Fonts.FRegular,
                        }}
                    >
                        {selectedFromDate ? formatForUI(selectedFromDate) : "From Date"}
                    </Text>
                </TouchableOpacity>

                {showFromPicker && (
                    <DateTimePicker
                        value={today}
                        mode="date"
                        display="default"
                        maximumDate={today}
                        onChange={(event, date) => {
                        setShowFromPicker(false);
                        if (event.type === "set" && date) {
                            setSelectedFromDate(formatForDB(date));
                        }
                        }}
                    />
                )}
            </View>

            <View style={styles.fromDateContainer}>
                <TouchableOpacity
                    onPress={() => setShowToPicker(true)}
                    style={{
                        borderWidth: 1,
                        borderColor: selectedToDate ? COLORS.GREY : "#ccc",
                        borderRadius: 10,
                        paddingVertical: responsiveSize(4.6),
                        paddingHorizontal: responsiveSize(2),
                        backgroundColor: COLORS.WHITE,
                    }}
                    activeOpacity={0.7}
                >
                    <Text
                        style={{
                        color: selectedToDate ? "#111" : "#888",
                        fontSize: responsiveSize(4),
                        fontFamily: Platform.OS === "ios" ? FontFamily.FRegular : Fonts.FRegular,
                        }}
                    >
                        {selectedToDate ? formatForUI(selectedToDate) : "To Date"}
                    </Text>
                </TouchableOpacity>

                {showToPicker && (
                    <DateTimePicker
                        value={today}
                        mode="date"
                        display="default"
                        maximumDate={today}
                        onChange={(event, date) => {
                        setShowToPicker(false);
                        if (event.type === "set" && date) {
                            setSelectedToDate(formatForDB(date));
                        }
                        }}
                    />
                )}
            </View>
        </View>

        <View style={styles.filterContainer}>
            <View style={styles.partyContainer}>
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
                    value={selectedParty} // ✅ use state here
                    onChange={(item) => setSelectedParty(item.value)} // ✅ update state
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
            </View>

            <View style={styles.applyContainer}>
               {/* Search Button */}
                <View>
                    <ButtonComp  onPress={handleSearch}>
                        <CText type='tiny'>Apply</CText>
                    </ButtonComp>
                </View>
               
            </View>
        </View>

      {/* List */}
        {loading ? (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={COLORS.PRIMARY} />
            </View>
        ) : !statementData ? (
            <View style={{ paddingTop: 10, paddingHorizontal: 16 }}>
                <Text style={{ fontSize: 16, color: "#666", textAlign: "center" }}>
                    Please select Party and Date range to get the statement
                </Text>
            </View>
        ) : statementData?.transactions?.length === 0 ? (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <Text style={{ fontSize: 16, color: "#666" }}>No records found!</Text>
            </View>
)       : (
            <>
            {statementData?.total_balance &&
                <View style={styles.filterContainer}>
                    <Text style={styles.dateDay}>Total Bal: ₹ {statementData?.total_balance}</Text>
                </View>
            }

                <FlatList
                data={statementData?.transactions}
                renderItem={renderItem}
                keyExtractor={(item) => item?.transvno?.toString()}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                />
            </>
        )}
    </View>
  );
};

export default Statement;

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
        paddingHorizontal: 16,
        paddingVertical:18,
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
    filterContainer:{
        flexDirection:"row",
        justifyContent:"space-between",
        // width:"100%",
        paddingHorizontal: dynamicSize(10, true),
        paddingBottom:15
    },
    partyContainer:{
        width:"48%",
        marginRight:5
    },
    fromDateContainer:{
        width:"48%"
    },
    applyContainer:{
        width:"48%"
    },
    // dropdown: {
    //     flexDirection: "row",
    //     alignItems: "center",
    //     paddingHorizontal:10,
    //     paddingVertical:18,
    //     borderColor: COLORS.GREY,
    //     borderWidth: 1.3,
    //     borderRadius:10,
    //     marginBottom:10
    // },
    dropdown: {
        borderWidth: 1,
        borderColor: COLORS.GREY,
        borderRadius: 10,
        paddingHorizontal: responsiveSize(2),
        paddingVertical: responsiveSize(4.6),
        backgroundColor: COLORS.WHITE,
    },
    placeholderStyle: {
        fontSize: responsiveSize(4),
        color: "#888", // 👈 same as date picker placeholder
        fontFamily: Platform.OS === "ios" ? FontFamily.FRegular : Fonts.FRegular,
    },
    selectedTextStyle: {
        fontSize: responsiveSize(4),
        color: "#111", // 👈 same as selected text in date picker
        fontFamily: Platform.OS === "ios" ? FontFamily.FRegular : Fonts.FRegular,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: responsiveSize(4),
        fontFamily: Platform.OS === "ios" ? FontFamily.FRegular : Fonts.FRegular,
    },
    iconStyle: {
        marginRight: 8,
    },
    card: {
        flexDirection: "row",
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 12,
        marginBottom: 12,
        elevation: 3, // Android shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        alignItems: "center",
    },
    dateBox: {
        backgroundColor: "#f2f2f2",
        padding: 8,
        borderRadius: 8,
        alignItems: "center",
        width: 50,
    },
    dateDay: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    dateMonth: {
        fontSize: 12,
        color: "#888",
        marginTop: -4,
    },
    details: {
        fontSize: 16,
        fontWeight: "600",
        color: "#222",
        textTransform:"capitalize"
    },
    subDetails: {
        fontSize: 14,
        color: "#666",
        marginTop: 2,
    },
    amountBox: {
        flexDirection: "row",
        alignItems: "center",
    },
    amount: {
        fontSize: 16,
        fontWeight: "700",
        marginLeft: 6,
    },
});
