import {StyleSheet} from "react-native";
import { COLORS } from "../../themes/variables";
import { dynamicSize } from "../../utils/utils";
export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:COLORS.PRIMARY,
    alignItems:'center',
    justifyContent:'center',
    paddingHorizontal: dynamicSize(20, true)
  },
  TextWrapper:{
    paddingTop:15
  }
});
