import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Appearance, StatusBar, useColorScheme, View } from 'react-native';
import { PaperProvider, Text } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast, { ToastConfig } from 'react-native-toast-message';
import { Provider } from 'react-redux';
import ErrorBoundary from './src/components/ErrorBoundary';
import RootNavigator from './src/navigation/RootNavigator';
import { store } from './src/store';

const toastConfig: ToastConfig = {
  success: ({ text1, ...rest }) => (
    <View
      style={{
        height: 60,
        backgroundColor: 'green',
        justifyContent: 'center',
        paddingHorizontal: 16,
        borderRadius: 8,
        zIndex: 9999, // Make sure it's on top
        elevation: 9999, // Android elevation
      }}
    >
      <Text style={{ color: '#fff', fontWeight: '700' }}>{text1}</Text>
    </View>
  ),
  error: ({ text1, ...rest }) => (
    <View
      style={{
        height: 60,
        backgroundColor: 'red',
        justifyContent: 'center',
        paddingHorizontal: 16,
        borderRadius: 8,
        zIndex: 9999, // Make sure it's on top
        elevation: 9999, // Android elevation
      }}
    >
      <Text style={{ color: '#fff', fontWeight: '700' }}>{text1}</Text>
    </View>
  ),
};

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
            </NavigationContainer>
            <Toast config={toastConfig} />
          </PaperProvider>
        </Provider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
};

export default App;
