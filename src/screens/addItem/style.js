import {StyleSheet, Platform} from "react-native";
import { COLORS, FontFamily, Fonts } from "../../themes/variables";
import { dynamicSize, responsiveSize } from "../../utils/utils";
export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:COLORS.WHITE,
        paddingHorizontal: dynamicSize(10, true),
        paddingTop:Platform.OS == "ios" ?  10 :50
    },
    dropdown: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal:10,
        paddingVertical:18,
        borderColor: COLORS.GREY,
        borderWidth: 1.3,
        borderRadius:10,
        marginBottom:10
    },
    errorText:{
        fontSize: responsiveSize(4),
        color: COLORS.RED,
        fontFamily: Platform?.OS =="ios"  ? FontFamily.FMedium : Fonts.FMedium,
    },
    listContainer:{
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        justifyContent: 'space-between',
    },
    headerTitle: {
        fontSize: responsiveSize(5),
        fontFamily: Platform?.OS =="ios"  ? FontFamily.FSemiBold : Fonts.FSemiBold,
        color: '#222',
    },
    
});
