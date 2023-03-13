import {Dimensions} from 'react-native';

export const {width, height} = Dimensions.get('window');

export const guidelineBaseWidth = 414;
export const guidelineBaseHeight = 896;

const widthRatio = width / guidelineBaseWidth;
const heightRatio = height / guidelineBaseHeight;

const scale = size => widthRatio * size;
const verticalScale = size => heightRatio * size;

const defaultModerateFactor = width > guidelineBaseWidth ? 0.5 : 1.25;

const moderateScale = (size, factor = defaultModerateFactor) =>
  size + (scale(size) - size) * factor;

export {scale, moderateScale, verticalScale};
