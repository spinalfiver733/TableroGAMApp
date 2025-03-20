import React, { useState } from 'react';
import {View,Text,TextInput,TouchableOpacity,StyleSheet,Image,Alert,KeyboardAvoidingView,Platform,ScrollView} from 'react-native';
import { Colors } from '../constants/Colors';
import Icon from 'react-native-vector-icons/FontAwesome';
/*import AsyncStorage from '@react-native-async-storage/async-storage';*/

// Credenciales predefinidas
const PREDEFINED_USERNAME = 'corazonesgam';
const PREDEFINED_PASSWORD = 'lateconfuerza';

const LoginScreen = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // Validación básica
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Por favor ingresa usuario y contraseña');
      return;
    }

    try {
      // Verificar contra credenciales predefinidas
      if (username === PREDEFINED_USERNAME && password === PREDEFINED_PASSWORD) {
        // Guardar token de sesión y continuar
        onLoginSuccess();
      } else {
        Alert.alert('Error', 'Credenciales incorrectas');
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al iniciar sesión');
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>CORAZONES</Text>
            <Text style={styles.subtitleText}>campaña de afiliación</Text>
          </View>
          <Image 
            source={require('../assets/Log.webp')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        
        <View style={styles.loginContainer}>
          <View style={styles.formContainer}>
            <View style={styles.inputGroupRemitente}>
              <View style={styles.iconSection}>
                <Icon name="user" size={30} color="white" />
              </View>
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>remitente</Text>
                <TextInput
                  style={styles.userInput}
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Usuario"
                  placeholderTextColor="#71112C"
                />
              </View>
            </View>

            <View style={styles.inputGroupContrasena}>
              <View style={styles.iconSection}>
                <Icon name="key" size={30} color="white" />
              </View>
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>contraseña</Text>
                <TextInput
                  style={styles.passwordInput}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  placeholder="Contraseña"
                  placeholderTextColor="#71112C"
                />
              </View>
            </View>

            <TouchableOpacity 
              style={styles.loginButton}
              onPress={handleLogin}
            >
              <Text style={styles.loginButtonText}>Ingresar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  titleContainer: {
    marginRight: 20,
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.white,
    textTransform: 'uppercase',
  },
  subtitleText: {
    fontSize: 16,
    color: Colors.white,
    textAlign: 'center', // Esto centra el texto horizontalmente
  },
  logo: {
    width: 180,
    height: 80,
  },
  loginContainer: {
    backgroundColor: Colors.background,
    borderRadius: 25,
    width: '100%',
    maxWidth: 400,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  formContainer: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 20,
    zIndex: 2,
  },
  inputGroupRemitente: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 15,
    marginBottom: 15,
    padding: 12,
    alignItems: 'center',
  },
  inputGroupContrasena: {
    flexDirection: 'row',
    backgroundColor: Colors.secondary,
    borderRadius: 15,
    marginBottom: 15,
    padding: 12,
    alignItems: 'center',
  },
  iconSection: {
    backgroundColor: Colors.background,
    width: 60,
    height: 60,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  inputSection: {
    flex: 1,
  },
  inputLabel: {
    color: Colors.background,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userInput: {
    width: '100%',
    backgroundColor: Colors.secondary,
    padding: 8,
    borderRadius: 8,
    fontSize: 16,
    color: 'black',
  },
  passwordInput: {
    width: '100%',
    backgroundColor: Colors.white,
    padding: 8,
    borderRadius: 8,
    fontSize: 16,
    color: 'black',
  },
  loginButton: {
    backgroundColor: Colors.background,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  loginButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});

export default LoginScreen;