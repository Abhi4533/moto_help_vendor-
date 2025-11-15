import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Appearance, StatusBar, useColorScheme } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import ErrorBoundary from './src/components/ErrorBoundary';
import RootNavigator from './src/navigation/RootNavigator';
import { store } from './src/store';
const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  // Initialize app
  useEffect(() => {
    Appearance.setColorScheme('light');
  }, []);

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <Provider store={store}>
          <PaperProvider>
            <NavigationContainer>
              <RootNavigator />
              <Toast />
            </NavigationContainer>
          </PaperProvider>
        </Provider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
};

export default App;
