import {StyleProp, StyleSheet, Text, TextStyle, Dimensions, Platform} from 'react-native';
import React, {ReactNode} from 'react';
import { responsiveSize } from '../../../utils/utils';
import { COLORS, FontFamily, Fonts } from '../../../themes/variables';
// import {responsiveSize} from '@/utils/utils';
// import {COLORS, FontFamily} from '@/themes/variables';

type CTextType = {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
  type?: string;
  onPress?: any;
};

export function CText({children, style, type, onPress}: CTextType) {
  return (
    <Text
      onPress={onPress}
      style={[
        style,
        type === 'exLarge'
          ? styles.exLarge
          : type === 'lg'
          ? styles.large
          : type === 'md'
          ? styles.medium
          : type === 'sm'
          ? styles.small
          : type === 'smBold'
          ? styles.smallBold
          : type === 'tiny'
          ? styles.tiny
          : type === 'labelsm'
          ? styles.labelSmall
          : style,
      ]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  exLarge: {
    fontSize: responsiveSize(10),
    fontFamily: FontFamily.FMedium,
    color: COLORS.BLACK,
  },
  large: {
    fontSize: responsiveSize(10),
    fontFamily: FontFamily.FMedium,
    color: COLORS.BLACK,
  },
  medium: {
    fontSize: responsiveSize(6.5),
    fontFamily: Platform?.OS =="ios"  ? FontFamily.FSemiBold : Fonts.FSemiBold,
    color: COLORS.BLACK,
  },
  small: {
    fontSize: responsiveSize(4.5),
    color: COLORS.BLACK,
    fontFamily: Platform?.OS =="ios"  ? FontFamily.FRegular : Fonts.FRegular,
  },
  smallBold:{
    fontSize: 20,
    lineHeight:28,
    color: COLORS.BLACK,
    fontFamily: Platform?.OS =="ios"  ? FontFamily.FMedium : Fonts.FMedium,
  },
  labelSmall:{
    fontSize: responsiveSize(4),
    color: COLORS.BLACK,
    fontFamily: Platform?.OS =="ios"  ? FontFamily.FMedium : Fonts.FMedium,
  },
  tiny: {
    fontSize: responsiveSize(4),
    color: COLORS.WHITE,
    fontFamily:Platform?.OS =="ios"  ?  FontFamily.FSemiBold : Fonts.FMedium,
  }
});
