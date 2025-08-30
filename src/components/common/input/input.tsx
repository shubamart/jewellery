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
import VectorIcons from 'themes/vectorIcons';

type InputProps = {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  style?: StyleProp<ViewStyle>;
  icon?: {
    type: string;
    name: string;
    size: number;
    onPress: () => void;
    style?: StyleProp<ViewStyle>;
  };
  props?: TextInputProps;
  multiLine?: boolean;
  autoFocus?: boolean;
  error?: string;
  keyboardType?:string;
  textAlignVertical?:string;
  numberOfLines?:number;
  
};

export function InputComp({
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  style,
  icon,
  props,
  multiLine,
  autoFocus,
  error,
  keyboardType = 'default',
  textAlignVertical,
  editable,
  numberOfLines,
}: InputProps) {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={COLORS.BLACK}
        style={[styles.inputStyle, style, {height:multiLine ? 120 :55}]}
        // maxLength={multiLine ? undefined : 50}
        onChangeText={(text: string) => onChangeText?.(text)}
        value={value}
        autoFocus={autoFocus}
        secureTextEntry={secureTextEntry}
        multiline={multiLine}
        keyboardType={keyboardType}
        numberOfLines={numberOfLines}
        textAlignVertical={textAlignVertical}
        editable={editable}
        {...props}
      />

        {icon && 
          <View style={[Layout.positionA, styles.iconStyle, {top:0, right:0}]}>
              {icon}
          </View> 
        }
        {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

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
