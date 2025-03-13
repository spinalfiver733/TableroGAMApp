import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

const NameSection = ({ 
  nombre, 
  apellidoPaterno, 
  apellidoMaterno, 
  onChangeNombre, 
  onChangeApellidoPaterno, 
  onChangeApellidoMaterno,
  apellidoPaternoDisabled,
  apellidoMaternoDisabled
}) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>nombre completo</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="nombre(s)"
          placeholderTextColor="rgba(0,0,0,0.5)"
          value={nombre}
          onChangeText={onChangeNombre}
        />
        <TextInput
          style={[styles.input, apellidoPaternoDisabled && styles.inputDisabled]}
          placeholder="apellido paterno"
          placeholderTextColor="rgba(0,0,0,0.5)"
          value={apellidoPaterno}
          onChangeText={onChangeApellidoPaterno}
          editable={!apellidoPaternoDisabled}
        />
        <TextInput
          style={[styles.input, apellidoMaternoDisabled && styles.inputDisabled]}
          placeholder="apellido materno"
          placeholderTextColor="rgba(0,0,0,0.5)"
          value={apellidoMaterno}
          onChangeText={onChangeApellidoMaterno}
          editable={!apellidoMaternoDisabled}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: Colors.secondary,
    borderRadius: 25,
    padding: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    color: Colors.white,
    fontSize: 16,
    marginBottom: 10,
    textTransform: 'lowercase',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 25,
    padding: 12,
    fontSize: 14,
    width: '32%',
    marginBottom: 5,
  },
  inputDisabled: {
    opacity: 0.7,
  },
});

export default NameSection;