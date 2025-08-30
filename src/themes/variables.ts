import {responsiveSize} from '../utils/utils';

export const Layout = {
  alignCenter: {
    alignItems: 'center' as 'center',
    justifyContent: 'center' as 'center',
  },
  rowJCenter: {
    flexDirection: 'row' as 'row',
    justifyContent: 'space-between' as 'space-between',
    alignItems: 'center' as 'center',
  },
  rowARCenter: {
    flexDirection: 'row' as 'row',
    justifyContent: 'space-around' as 'space-around',
    alignItems: 'center' as 'center',
  },
  justifyCContent: {
    justifyContent: 'center' as 'center',
  },
  row: {
    flexDirection: 'row' as 'row',
  },
  justifyCenter:{
    justifyContent:"center" as "center",
  },
  alignCenterComp:{
    alignItems:'center' as 'center'
  },
  justifySBContent: {
    flexDirection: 'row' as 'row',
    justifyContent: 'space-between' as 'space-between',
  },
  fill: {
    flex: 1,
  },
  fillB: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  positionA: {position: 'absolute' as 'absolute'},
  positionR: {position: 'relative' as 'relative'},
  rowACenter: {
    flexDirection: 'row' as 'row',
    alignItems: 'center' as 'center',
  },
  rowCCenter: {
    flexDirection: 'row' as 'row',
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
  },
  columnSFlexStart: {
    flexDirection: 'column' as 'column',
    justifyContent: 'space-between' as 'space-between',
    alignItems: 'flex-start' as 'flex-start',
  },
  column: {
    flexDirection: 'column' as 'column',
  },
  flexAStart: {
    justifyContent: 'flex-start' as 'flex-start',
    alignItems: 'flex-start' as 'flex-start',
  },
  flexAEnd: {
    justifyContent: 'flex-end' as 'flex-end',
    alignItems: 'flex-end' as 'flex-end',
  },
  rowFlexEnd: {
    flexDirection: 'row' as 'row',
    justifyContent: 'flex-end' as 'flex-end',
    alignItems: 'flex-end' as 'flex-end',
  },
  rowFlexStart: {
    flexDirection: 'row' as 'row',
    justifyContent: 'flex-start' as 'flex-start',
    alignItems: 'flex-start' as 'flex-start',
  },
  flexStart: {
    justifyContent: 'flex-start' as 'flex-start',
  },
  flexEnd: {
    justifyContent: 'flex-end' as 'flex-end',
  },
  textCenter: {
    textAlign: 'center' as 'center',
  },
  rowSpaceEvenly: {
    flexDirection: 'row' as 'row',
    justifyContent: 'space-evenly' as 'space-evenly',
    alignItems: 'center' as 'center',
  },
  columnCenter: {
    flexDirection: 'column' as 'column',
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
  },
  wrapB: {
    flexWrap: 'wrap' as 'wrap',
    flexDirection: 'row' as 'row',
    display: 'flex' as 'flex',
    justifyContent: 'space-between' as 'space-between',
  },
  flexEndA: {
    alignItems: 'flex-end' as 'flex-end',
  },
  flexWrapA:{
    flexWrap:'wrap' as 'wrap'
  }
};

export const FontFamily = {
  FLight: 'Jost-Light',
  FRegular: 'Jost-Regular',
  FMedium: 'Jost-Medium',
  FSemiBold: 'Jost-SemiBold'
};

export const Fonts = {
  FLight: 'Jost-Light',
  FRegular: 'Jost-Regular',
  FMedium: 'Jost-Medium',
  FSemiBold: 'Jost-SemiBold'
};

export const COLORS = {
  PRIMARY: '#2d6057',
  DARK_PRIMARY: '#17AD7F',
  DARK_BLUE:'#A9A9A9',
  DARK_GREEN:'#118A65',
  LIGHT_GREEN:'#17AD7F',
  BLUE:'#2561ED',
  WHITE: '#FFFFFF',
  BLACK: '#1C1C1C',
  GREY: '#A4A9B6',
  BUTTON_GREY:'#E2E4E8',
  LIGHT_GREY: '#707B81',
  LIGHT2_GREY:'#E2E4E8',
  LIGHT_PRIMARY: '#FEFAE0',
  CREAM: '#F0ECF3',
  LIGHT_BLACK: '#707B81',
  LIGHT_BLUE: '#5B9EE1',
  LIGHT_WHITE: '#F2F2F2',
  LIGHT_WHITE2: '#F8F9FA',
  RED: '#C80036',
  DARk_GREY: '#747C90',
  LIGHT_GREY_2: '#F5F6F7',
  ALPHA_WHITE: '#FEFAF0',
  BROWN: '#856B2B',
};

export const ICONS_NAME = {
  filterVariant: 'filter',
  storefront: 'storefront',
  plus: 'plus',
  heart: 'heart',
  hearto: 'hearto',
  arrowRight: 'arrowright',
  arrowLeft: 'arrowleft',
  star: 'star',
  minus: 'minus',
  bell: 'bell',
  cart: 'cart',
  home: 'home',
  user: 'user',
  right: 'right',
  google: 'google',
  facebook: 'facebook',
  apple1: 'apple',
  delete: 'delete-forever',
  cross: 'closecircle',
  cartArrowDown: 'cart-arrow-down',
  eye: 'eye-outline',
  eyeOff: 'eye-off-outline',
  storefrontOutline: 'storefront-outline',
  dotsGrid: 'dots-grid',
  heartOutline: 'heart-outline',
  mapMarker: 'map-marker',
  magnify: 'magnify',
  homeOutline: 'home-outline',
  bellOutline: 'bell-outline',
  accountOutline: 'account-outline',
  account: 'account',
  mail: 'mail',
  phone: 'phone',
  edit: 'edit',
  down: 'menu-down',
  up: 'menu-up',
  logout: 'logout',
  camera: 'camerao',
  dotVertical: 'dots-vertical',
  location: 'map-marker',
  search: 'search1',
  copy: 'content-copy',
  fileDownload: 'file-download-outline',
  shield: 'shield-check',
};

export const ICONS_TYPE = {
  MaterialCommunityIcons: 'MaterialCommunityIcons',
  AntDesign: 'AntDesign',
};

export const MARGIN_H_SMALL = {
  marginHorizontal: responsiveSize(1),
};
export const MARGIN_H_MEDIUM = {
  marginHorizontal: responsiveSize(2),
};
export const MARGIN_H_LARGE = {
  marginHorizontal: responsiveSize(3),
};
export const PADDING_H_SMALL = {
  paddingHorizontal: responsiveSize(1),
};
export const PADDING_H_MEDIUM = {
  paddingHorizontal: responsiveSize(2),
};
export const PADDING_H_LARGE = {
  paddingHorizontal: responsiveSize(3),
};

export const MARGIN_V_TINY = {
  marginVertical: responsiveSize(0.5),
};
export const MARGIN_V_SMALL = {
  marginVertical: responsiveSize(1),
};
export const MARGIN_V_MEDIUM = {
  marginVertical: responsiveSize(2),
};
export const MARGIN_V_LARGE = {
  marginVertical: responsiveSize(3),
};
export const MARGIN_V_MORELARGE = {
  marginVertical: responsiveSize(7),
};
export const PADDING_V_SMALL = {
  paddingVertical: responsiveSize(1),
};
export const PADDING_V_MEDIUM = {
  paddingVertical: responsiveSize(2),
};
export const PADDING_V_LARGE = {
  paddingVertical: responsiveSize(3),
};
export const MARGIN_T_SMALL = {
  marginTop: responsiveSize(6),
};
