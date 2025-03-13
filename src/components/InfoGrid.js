import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

const InfoGrid = ({
  dia,
  mes,
  anio,
  whatsapp,
  codigo,
  seccion,
  onChangeDia,
  onChangeMes,
  onChangeAnio,
  onChangeWhatsapp,
  onChangeCodigo,
  onChangeSeccion,
  whatsappDisabled,
  codigoDisabled,
  seccionDisabled
}) => {
  return (
    <View style={styles.row}>
      {/* Fecha de nacimiento */}
      <View style={styles.infoBox}>
        <Text style={styles.boxLabel}>fecha de nacimiento</Text>
        <View style={styles.dateInputs}>
          <TextInput
            style={styles.dateInput}
            placeholder="DD"
            placeholderTextColor={Colors.white}
            keyboardType="number-pad"
            maxLength={2}
            value={dia}
            onChangeText={onChangeDia}
          />
          <TextInput
            style={styles.dateInput}
            placeholder="MM"
            placeholderTextColor={Colors.white}
            keyboardType="number-pad"
            maxLength={2}
            value={mes}
            onChangeText={onChangeMes}
          />
          <TextInput
            style={styles.dateInput}
            placeholder="AAAA"
            placeholderTextColor={Colors.white}
            keyboardType="number-pad"
            maxLength={4}
            value={anio}
            onChangeText={onChangeAnio}
          />
        </View>
      </View>

      {/* WhatsApp */}
      <View style={[styles.infoBox, whatsappDisabled && styles.infoBoxDisabled]}>
        <Text style={styles.boxLabel}>whatsapp</Text>
        <TextInput
          style={styles.fullInput}
          keyboardType="phone-pad"
          value={whatsapp}
          onChangeText={onChangeWhatsapp}
          editable={!whatsappDisabled}
        />
      </View>

      {/* Código de verificación */}
      <View style={[styles.infoBox, codigoDisabled && styles.infoBoxDisabled]}>
        <Text style={styles.boxLabel}>código de verificación</Text>
        <TextInput
          style={styles.fullInput}
          value={codigo}
          onChangeText={onChangeCodigo}
          editable={!codigoDisabled}
        />
      </View>

      {/* Sección electoral */}
      <View style={[styles.infoBox, seccionDisabled && styles.infoBoxDisabled]}>
        <Text style={styles.boxLabel}>sección electoral</Text>
        <TextInput
          style={styles.fullInput}
          keyboardType="number-pad"
          value={seccion}
          onChangeText={onChangeSeccion}
          editable={!seccionDisabled}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  infoBox: {
    backgroundColor: Colors.white,
    borderRadius: 25,
    padding: 15,
    width: '24%', // Ajustado para 4 elementos en una fila
    marginBottom: 10,
  },
  infoBoxDisabled: {
    opacity: 0.7,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  boxLabel: {
    color: Colors.primary,
    fontSize: 14, // Reducido para acomodar en espacio más pequeño
    fontWeight: 'bold',
    marginBottom: 8,
  },
  dateInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateInput: {
    backgroundColor: Colors.background,
    borderRadius: 25,
    padding: 8, // Reducido para acomodar en espacio más pequeño
    textAlign: 'center',
    color: Colors.white,
    width: '30%',
    fontSize: 12, // Reducido para acomodar en espacio más pequeño
  },
  fullInput: {
    backgroundColor: Colors.background,
    borderRadius: 25,
    padding: 10, // Reducido para acomodar en espacio más pequeño
    textAlign: 'center',
    color: Colors.white,
    fontSize: 12, // Reducido para acomodar en espacio más pequeño
  },
});

export default InfoGrid;