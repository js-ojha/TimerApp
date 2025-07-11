import React from 'react';
import Text from '../../component/Text';
import ScreenContainer from '../../component/ScreenContainer';
import { View } from 'react-native';
import tw from '../../lib/tailwind';
import { useTheme } from '../../provider/ThemeProvider';

const Home = () => {
  const { colors } = useTheme();

  return (
    <ScreenContainer
      style={tw.style({ backgroundColor: colors.backgroundAlt })}
    >
      <View>
        <Text>home</Text>
      </View>
    </ScreenContainer>
  );
};

export default Home;
