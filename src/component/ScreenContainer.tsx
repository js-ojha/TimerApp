import { View } from 'react-native';
import React from 'react';
import { ClassInput } from 'twrnc';
import tw from '../lib/tailwind';

const ScreenContainer = ({
  style,
  children,
}: {
  style?: ClassInput;
  children?: React.ReactNode;
}) => {
  return <View style={tw.style('pt-4 px-2.5 flex-1', style)}>{children}</View>;
};

export default ScreenContainer;
