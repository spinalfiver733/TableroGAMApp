import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Colors } from '../constants/Colors';

const INESection = ({
  onPressAnverso,
  onPressReverso,
  onPressCompletado,
  ineDisabled,
  completadoDisabled,
  fotoAnverso,
  fotoReverso
}) => {
  return (
    <View style={styles.container}>
      <View style={[styles.ineContainer, ineDisabled && styles.ineContainerDisabled]}>
        <Text style={styles.ineTitle}>INE</Text>
        <TouchableOpacity 
          style={[
            styles.photoButton, 
            fotoAnverso ? styles.photoButtonSuccess : null
          ]} 
          onPress={onPressAnverso}
          disabled={ineDisabled}
        >
          {fotoAnverso ? (
            <View style={styles.photoPreviewContainer}>
              <Image source={{ uri: fotoAnverso }} style={styles.photoPreview} />
              <Text style={styles.photoCheckmark}>✓</Text>
            </View>
          ) : (
            <Text style={styles.photoText}>fotografía{'\n'}anverso</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.photoButton, 
            fotoReverso ? styles.photoButtonSuccess : null
          ]} 
          onPress={onPressReverso}
          disabled={ineDisabled}
        >
          {fotoReverso ? (
            <View style={styles.photoPreviewContainer}>
              <Image source={{ uri: fotoReverso }} style={styles.photoPreview} />
              <Text style={styles.photoCheckmark}>✓</Text>
            </View>
          ) : (
            <Text style={styles.photoText}>fotografía{'\n'}reverso</Text>
          )}
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
  style={[styles.completeButton, completadoDisabled && styles.completeButtonDisabled]}
  onPress={onPressCompletado}
  disabled={completadoDisabled}
>
  <View style={styles.completeContent}>
    <Text style={styles.completeText}>¡COMPLETADO!</Text>
    <Image 
      source={require('../assets/images/Corazon.png')} 
      style={styles.heartIcon}
      resizeMode="contain"
    />
  </View>
</TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  ineContainer: {
    backgroundColor: Colors.white,
    borderRadius: 25,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    width: '60%',
  },
  ineContainerDisabled: {
    opacity: 0.7,
  },
  ineTitle: {
    fontSize: 24,
    color: Colors.primary,
    fontWeight: 'bold',
    marginRight: 10,
  },
  photoButton: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 15,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    height: 80,
  },
  photoButtonSuccess: {
    backgroundColor: '#4CAF50',
  },
  photoText: {
    color: Colors.white,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  photoPreviewContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  photoPreview: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    opacity: 0.7,
  },
  photoCheckmark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -10 }, { translateY: -10 }],
    color: Colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  completeButton: {
    backgroundColor: '#B92C52',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '37%',
  },
  completeButtonDisabled: {
    opacity: 0.7,
  },
  completeText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  heartIcon: {
    color: Colors.white,
    fontSize: 24,
  },
  completeButton: {
    backgroundColor: '#B92C52',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '37%',
  },
  completeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeText: {
    color: Colors.white,
    fontSize: 30,
    fontWeight: 'bold',
    marginRight: 20, // Espacio entre el texto y el corazón
  },
  heartIcon: {
    width: 60,  // Reducir tamaño
    height: 60, // Reducir tamaño
    tintColor: Colors.white, // Asegurar que sea blanco
  },
});

export default INESection;