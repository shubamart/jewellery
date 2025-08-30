import {useNavigation} from '@react-navigation/native';
import {Dimensions} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
const {width} = Dimensions.get('window');
const {height} = Dimensions.get('window');

export const responsiveSize = (size: number) => {
  return (size * width) / 100;
};

export const dynamicSize = (val, byWidth = false) => {
	return RFValue(parseFloat(val), byWidth ? width : height)
};

export const useCustomNavigation = () => {
  const navigation: any = useNavigation();
  const navigate = (path?: any, data?: any) => {
    navigation.navigate(path, {data});
  };
  return {navigate};
};

export let emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export const validateForm = (
  fullName: string = '',
  email: string = '',
  userName: string = '',
  password: string = '',
  confirmPassword: string = '',
) => {
  let errors: string[] = [];

  if (fullName.trim() === '') {
    errors.push('Please enter a full name');
  }

  if (email.trim() === '') {
    errors.push('Please enter an email address');
  }

  if (userName.trim() === '') {
    errors.push('Please enter a username');
  }

  if (!/^[a-zA-Z]/.test(userName.trim())) {
    errors.push('Username must start with a letter');
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.push('Please enter a valid email address');
  }

  if (password !== confirmPassword) {
    errors.push('Passwords do not match');
  }

  return errors;
};
