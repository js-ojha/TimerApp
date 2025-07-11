import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './provider/ThemeProvider';
import RootNavigator from './navigation/RootNavigator';
import TimerProvider from './provider/TimerProvider';

const App = () => {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <TimerProvider>
          <RootNavigator />
        </TimerProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App;
