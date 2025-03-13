import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

const AddressSection = ({
  calle,
  numero,
  colonia,
  cp,
  onChangeCalle,
  onChangeNumero,
  onChangeColonia,
  onChangeCP,
  addressDisabled
}) => {
  return (
    <View style={[styles.section, addressDisabled && styles.sectionDisabled]}>
      <Text style={styles.sectionTitle}>dirección</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="calle"
          placeholderTextColor="rgba(0,0,0,0.5)"
          value={calle}
          onChangeText={onChangeCalle}
          editable={!addressDisabled}
        />
        <TextInput
          style={styles.input}
          placeholder="número"
          placeholderTextColor="rgba(0,0,0,0.5)"
          value={numero}
          onChangeText={onChangeNumero}
          editable={!addressDisabled}
        />
        <TextInput
          style={styles.input}
          placeholder="colonia"
          placeholderTextColor="rgba(0,0,0,0.5)"
          value={colonia}
          onChangeText={onChangeColonia}
          editable={!addressDisabled}
        />
        <TextInput
          style={styles.input}
          placeholder="código postal"
          placeholderTextColor="rgba(0,0,0,0.5)"
          value={cp}
          onChangeText={onChangeCP}
          keyboardType="number-pad"
          editable={!addressDisabled}
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
  sectionDisabled: {
    opacity: 0.7,
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
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 25,
    padding: 12,
    fontSize: 14,
    width: '24%', // Para 4 elementos en una fila
  },
});

export default AddressSection;