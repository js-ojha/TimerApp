import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ThemeProvider } from './provider/ThemeProvider'
import RootNavigator from './navigation/RootNavigator'

const App = () => {
  return (
    <SafeAreaProvider>
        <ThemeProvider>
            <RootNavigator />
        </ThemeProvider>
    </SafeAreaProvider>
  )
}

export default App