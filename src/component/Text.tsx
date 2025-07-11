import React from 'react';
import { TextProps, Text as _Text } from 'react-native';
import tw from '../lib/tailwind';
import { useTheme } from '../provider/ThemeProvider';

const Text = ({ style, ...props }: TextProps) => {
  const { colors } = useTheme();
  return (
    <_Text
      style={tw.style(
        'text-base',
        {
          color: colors.text,
        },
        // @ts-ignore
        style,
      )}
      maxFontSizeMultiplier={1.3}
      {...props}
    />
  );
};

export default Text;
