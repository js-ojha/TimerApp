import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './provider/ThemeProvider';
import RootNavigator from './navigation/RootNavigator';
import TimerProvider from './provider/TimerProvider';
import Toast from 'react-native-toast-message';

const App = () => {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <TimerProvider>
          <RootNavigator />
          <Toast />
        </TimerProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App;
