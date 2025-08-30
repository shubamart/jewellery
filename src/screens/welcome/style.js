import {StyleSheet, Platform} from "react-native";
import { COLORS, FontFamily, Fonts } from "../../themes/variables";
import { dynamicSize, responsiveSize } from "../../utils/utils";
export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:COLORS.WHITE,
        paddingHorizontal: dynamicSize(12, true),
        paddingTop:Platform.OS == "ios" ?  10 :50
    },
    gridContainer: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: '48%',
        backgroundColor: '#f2f2f2',
        borderRadius: 12,
        padding: 25,
        marginBottom: 20,
        alignItems: 'center',
        textAlign:"center",
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    title: {
        marginTop: 10,
        fontSize: responsiveSize(3.5),
        fontFamily: Platform.OS === 'ios' ? FontFamily.FMedium : Fonts.FMedium,
        color: '#333',
        textAlign: 'center',
        lineHeight:18
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
