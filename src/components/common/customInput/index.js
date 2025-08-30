// InputComp.js (enhanced)
import {
    StyleProp,
    StyleSheet,
    TextInput,
    TextInputProps,
    ViewStyle,
    Text,
    View,
    Platform,
  } from 'react-native';
  import React from 'react';
  import {COLORS, FontFamily, Fonts, Layout} from '../../../themes/variables';
  import {responsiveSize} from '../../../utils/utils';
  
export const CustomInputComp = ({ value, onChangeText, onBlur, onEndEditing, formatOnBlur, name, style, multiLine,  editable, ...props }) => {
    const handleEnd = (e) => {
      if (formatOnBlur) {
        const text = e.nativeEvent?.text ?? value ?? '';
        const num = parseFloat(text.toString().trim());
        if (!isNaN(num)) {
          // call parent's onChangeText with formatted text
          onChangeText && onChangeText(num.toFixed(3));
        }
      }
      onEndEditing && onEndEditing(e);
      onBlur && onBlur(e);
    };
  
    return (
      <View style={styles.container}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onEndEditing={handleEnd}
          style={[styles.inputStyle, style, {height:multiLine ? 120 :55}]}
          onBlur={onBlur}
          editable={editable}
          {...props}
        />
      </View>
    );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: responsiveSize(2),
  },
  inputStyle: {
    backgroundColor: COLORS.WHITE,
    fontSize: responsiveSize(4),
    color: COLORS.BLACK,
    borderRadius: 10,
    paddingHorizontal: responsiveSize(2),
    fontFamily:Platform.OS == "ios" ? FontFamily.FRegular :Fonts.FRegular,
    borderColor:COLORS.GREY,
    borderWidth:1,
    paddingVertical:responsiveSize(3.8)
  },
  errorText: {
    color: COLORS.RED,
    fontSize: responsiveSize(5),
    marginTop: 5,
    fontFamily: FontFamily.FRegular,
  },
  iconStyle:{
    width:55,
    height:55,
    justifyContent:"center",
    alignItems:'center'
  }
});
  