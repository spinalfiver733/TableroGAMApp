// En App.js
import React, { useState, useEffect } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import RegistrationScreen from './src/screens/RegistrationScreen';
import LoginScreen from './src/screens/LoginScreen';
import { Colors } from './src/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si el usuario ya está logueado
    const checkLoginStatus = async () => {
      try {
        const userToken = await AsyncStorage.getItem('user_token');
        setIsLoggedIn(!!userToken);
      } catch (error) {
        console.error('Error al verificar estado de login:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLoginSuccess = async () => {
    try {
      // Crear un token simple o usar un valor para indicar que el usuario está logueado
      await AsyncStorage.setItem('user_token', 'logged_in');
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Error al guardar estado de login:', error);
    }
  };

  // Función de cierre de sesión
  const handleLogout = async () => {
    try {
      // Eliminar el token de sesión
      await AsyncStorage.removeItem('user_token');
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }} />
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      {isLoggedIn ? (
        <RegistrationScreen onLogout={handleLogout} />
      ) : (
        <LoginScreen onLoginSuccess={handleLoginSuccess} />
      )}
    </SafeAreaView>
  );
}