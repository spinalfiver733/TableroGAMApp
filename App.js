import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import RegistrationScreen from './src/screens/RegistrationScreen';
import { Colors } from './src/constants/Colors';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <RegistrationScreen />
    </SafeAreaView>
  );
}