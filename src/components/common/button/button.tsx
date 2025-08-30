import {
    StyleProp,
    StyleSheet,
    ViewStyle,
    TouchableOpacity,
    TouchableOpacityProps,
  } from 'react-native';
  import React, {ReactNode} from 'react';
  import {COLORS} from '../../../themes/variables';
  import {responsiveSize} from '../../../utils/utils';
  
  type ButtonType = {
    onPress: () => void;
    children: ReactNode;
    style?: StyleProp<ViewStyle>;
    props?: TouchableOpacityProps;
    disabled:() => boolean;
  };
  
  export function ButtonComp({children, style, onPress, disabled, props}: ButtonType) {
    return (  
      <TouchableOpacity
        onPress={onPress}
        {...props}
        style={[
          { 
            backgroundColor: disabled ? COLORS.BUTTON_GREY : COLORS.PRIMARY,
          },
          styles.ctn,
          style,
        ]}
        disabled={disabled}>
        {children}
      </TouchableOpacity>
  
    );
  }
  const styles = StyleSheet.create({
    ctn: {
      
      alignItems: 'center',
      padding: responsiveSize(1.5),
      paddingVertical:responsiveSize(4.5),
      borderRadius: 6,
    },
  });
  