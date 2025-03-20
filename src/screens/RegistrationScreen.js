import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Image,TextInput,Alert} from 'react-native';
import { Colors } from '../constants/Colors';
import NetInfo from '@react-native-community/netinfo';
import * as ImagePicker from 'expo-image-picker';

// Importamos componentes
import NameSection from '../components/NameSection';
import InfoGrid from '../components/InfoGrid';
import AddressSection from '../components/AddressSection';
import INESection from '../components/INESection';

// Importamos las funciones de la API y almacenamiento
import { getRegistros, crearRegistro, checkConnection } from '../services/apiService';
import { guardarRegistroPendiente, obtenerRegistrosPendientes, contarRegistrosPendientes, eliminarRegistrosPendientes } from '../services/storageService';

// Componente adaptado para web e imágenes
const WebImage = (props) => {
  const { source, style, resizeMode } = props;
  if (Platform.OS === 'web') {
    const imageUrl = typeof source === 'number' ? 
      // Para imágenes locales (require)
      source : 
      // Para URLs remotas
      source?.uri;
    return (
      <div 
        style={{
          ...style,
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: resizeMode === 'contain' ? 'contain' : 
                         resizeMode === 'cover' ? 'cover' : 'auto',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
    );
  }
  return <Image {...props} />;
};

const RegistrationScreen = ({ onLogout }) => {
  // Estado para la conexión
  const [isConnected, setIsConnected] = useState(true);
  const [apiStatus, setApiStatus] = useState('Cargando...');
  const [pendingCount, setPendingCount] = useState(0);
  
  // Estado para el formulario completo (combinando ambas versiones)
  const [nombre, setNombre] = useState('');
  const [apellidoPaterno, setApellidoPaterno] = useState('');
  const [apellidoMaterno, setApellidoMaterno] = useState('');
  
  const [dia, setDia] = useState('');
  const [mes, setMes] = useState('');
  const [anio, setAnio] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [codigo, setCodigo] = useState('');
  const [codigoVerificacion, setCodigoVerificacion] = useState('');
  const [seccion, setSeccion] = useState('');
  const [seccionElectoral, setSeccionElectoral] = useState('');
  
  const [calle, setCalle] = useState('');
  const [numero, setNumero] = useState('');
  const [colonia, setColonia] = useState('');
  const [cp, setCP] = useState('');
  const [codigoPostal, setCodigoPostal] = useState('');
  
  // Estado para las imágenes
  const [fotoAnverso, setFotoAnverso] = useState(null);
  const [fotoReverso, setFotoReverso] = useState(null);
  const [fotoIneAnverso, setFotoIneAnverso] = useState(null);
  const [fotoIneReverso, setFotoIneReverso] = useState(null);
  
  // Estado para el envío del formulario
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [debugInfo, setDebugInfo] = useState('');

  // Funciones para sincronizar estados entre versiones
  useEffect(() => {
    if (dia && mes && anio) {
      const nuevaFecha = `${anio}-${mes}-${dia}`;
      if (nuevaFecha !== fechaNacimiento) {
        setFechaNacimiento(nuevaFecha);
      }
    }
  }, [dia, mes, anio]);

  useEffect(() => {
    if (fechaNacimiento && fechaNacimiento.includes('-')) {
      const partes = fechaNacimiento.split('-');
      if (partes.length === 3) {
        if (partes[0] !== anio) setAnio(partes[0]);
        if (partes[1] !== mes) setMes(partes[1]);
        if (partes[2] !== dia) setDia(partes[2]);
      }
    }
  }, [fechaNacimiento]);

  useEffect(() => {
    if (codigo && codigo !== codigoVerificacion) {
      setCodigoVerificacion(codigo);
    }
  }, [codigo]);
  
  useEffect(() => {
    if (codigoVerificacion && codigoVerificacion !== codigo) {
      setCodigo(codigoVerificacion);
    }
  }, [codigoVerificacion]);

  useEffect(() => {
    if (seccion && seccion !== seccionElectoral) {
      setSeccionElectoral(seccion);
    }
  }, [seccion]);
  
  useEffect(() => {
    if (seccionElectoral && seccionElectoral !== seccion) {
      setSeccion(seccionElectoral);
    }
  }, [seccionElectoral]);

  useEffect(() => {
    if (cp && cp !== codigoPostal) {
      setCodigoPostal(cp);
    }
  }, [cp]);
  
  useEffect(() => {
    if (codigoPostal && codigoPostal !== cp) {
      setCP(codigoPostal);
    }
  }, [codigoPostal]);

  useEffect(() => {
    if (fotoAnverso && fotoAnverso !== fotoIneAnverso) {
      setFotoIneAnverso(fotoAnverso);
    }
  }, [fotoAnverso]);
  
  useEffect(() => {
    if (fotoIneAnverso && fotoIneAnverso !== fotoAnverso) {
      setFotoAnverso(fotoIneAnverso);
    }
  }, [fotoIneAnverso]);
  
  useEffect(() => {
    if (fotoReverso && fotoReverso !== fotoIneReverso) {
      setFotoIneReverso(fotoReverso);
    }
  }, [fotoReverso]);
  
  useEffect(() => {
    if (fotoIneReverso && fotoIneReverso !== fotoReverso) {
      setFotoReverso(fotoIneReverso);
    }
  }, [fotoIneReverso]);

  // Función para probar la API (GET)
  const probarConexionAPI = async () => {
    setApiStatus('Consultando API...');
    
    try {
      console.log('Probando conexión a la API...');
      const resultado = await getRegistros();
      if (resultado.success) {
        console.log('Conexión exitosa a la API');
        const cantidadRegistros = Array.isArray(resultado.data) ? resultado.data.length : 'desconocida';
        setApiStatus(`Conexión exitosa! Se recibieron ${cantidadRegistros} registros.`);
      } else {
        console.log('Error al conectar con la API:', resultado.error);
        setApiStatus(`Error: ${resultado.error}`);
      }
    } catch (error) {
      console.error('Error inesperado:', error);
      setApiStatus(`Error inesperado: ${error.message}`);
    }
  };

  // Función para seleccionar imágenes
  const seleccionarImagen = async (setImagen) => {
    try {
      let result;
      // En web usamos input file
      if (Platform.OS === 'web') {
        // Crear input de tipo file
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        // Crear promesa para manejar la selección
        const filePromise = new Promise((resolve) => {
          input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
              resolve(file);
            } else {
              resolve(null);
            }
          };
        });
        
        // Simular clic en el input
        input.click();
        // Esperar a que el usuario seleccione un archivo
        const file = await filePromise;
        if (file) {
          // Convertir el archivo a base64 inmediatamente
          const reader = new FileReader();
          reader.readAsDataURL(file);
          
          const base64Promise = new Promise((resolve) => {
            reader.onload = () => resolve(reader.result);
          });
          
          const base64Data = await base64Promise;
          setImagen(base64Data);
          
          console.log('Imagen convertida a base64 y guardada');
          return file.name;
        }
      } else {
        // Opciones para dispositivos móviles
        Alert.alert(
          'Seleccionar Imagen',
          '¿Cómo quieres obtener la imagen?',
          [
            {
              text: 'Cancelar',
              style: 'cancel',
            },
            {
              text: 'Tomar Foto',
              onPress: () => tomarFoto(setImagen),
            },
            {
              text: 'Seleccionar de Galería',
              onPress: async () => {
                // En móviles usamos ImagePicker con base64 habilitado
                result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                  allowsEditing: true,
                  aspect: [4, 3],
                  quality: 0.7, // Calidad reducida para tamaño menor
                  base64: true  // Habilitar base64
                });
                
                if (!result.canceled && result.assets && result.assets.length > 0) {
                  // Construir la cadena base64 completa
                  const base64 = `data:image/jpeg;base64,${result.assets[0].base64}`;
                  setImagen(base64);
                  console.log('Imagen móvil convertida a base64 y guardada');
                  return result.assets[0].uri.split('/').pop();
                }
              },
            },
          ]
        );
      }
      
      return null;
    } catch (error) {
      console.error('Error al seleccionar imagen:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
      return null;
    }
  };

  const tomarFoto = async (setImagen) => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Construir la cadena base64 completa
        const base64 = `data:image/jpeg;base64,${result.assets[0].base64}`;
        setImagen(base64);
        console.log('Foto tomada y convertida a base64');
        return result.assets[0].uri.split('/').pop();
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo tomar la foto: ' + error.message);
    }
  };

  // Lógica para habilitar/deshabilitar campos
  const apellidoPaternoDisabled = nombre.trim() === '';
  const apellidoMaternoDisabled = apellidoPaterno.trim() === '' || apellidoPaternoDisabled;
  
  const fechaCompleta = (dia.length === 2 && mes.length === 2 && anio.length === 4) || 
                        (fechaNacimiento && fechaNacimiento.match(/^\d{4}-\d{2}-\d{2}$/));
  const whatsappDisabled = !fechaCompleta || apellidoMaternoDisabled;
  const codigoDisabled = (whatsapp.length < 10 && !codigoVerificacion) || whatsappDisabled;
  const seccionDisabled = (codigo.trim() === '' && codigoVerificacion.trim() === '') || codigoDisabled;
  const addressDisabled = (seccion.trim() === '' && seccionElectoral.trim() === '') || seccionDisabled;
  const ineDisabled = addressDisabled || 
                     (!calle || !numero || 
                      !colonia || (!cp && !codigoPostal));
  
  const formCompleto = (fotoAnverso || fotoIneAnverso) && 
                      (fotoReverso || fotoIneReverso) && 
                      !ineDisabled;

  // Función para enviar el formulario
  const enviarFormulario = async () => {
    if ((!fotoAnverso && !fotoIneAnverso) || (!fotoReverso && !fotoIneReverso)) {
      Alert.alert('Error', 'Debes seleccionar ambas imágenes');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitResult(null);
    /*setDebugInfo('Preparando datos para enviar...');*/
    
    try {
      // Añadir fecha actual
      const fechaActual = new Date();
      const fechaRegistro = fechaActual.toISOString().split('T')[0]; // formato YYYY-MM-DD
      
      // Crear objeto con los datos del formulario
      const formData = {
        nombre,
        apellido_paterno: apellidoPaterno,
        apellido_materno: apellidoMaterno,
        fecha_nacimiento: fechaNacimiento || `${anio}-${mes}-${dia}`,
        whatsapp,
        codigo_verificacion: codigoVerificacion || codigo,
        seccion_electoral: seccionElectoral || seccion,
        calle,
        numero,
        colonia,
        codigo_postal: codigoPostal || cp,
        fecha_registro: fechaRegistro,
        foto_ine_anverso: fotoIneAnverso || fotoAnverso,
        foto_ine_reverso: fotoIneReverso || fotoReverso
      };
      
      //setDebugInfo('Enviando datos a la API...');
      
      // Verificar conexión en tiempo real
      const isOnline = await checkConnection();
      
      if (isOnline) {
        // Intentar enviar directamente a la API
        const resultado = await crearRegistro(formData);
        
        if (resultado.success) {
          console.log('Registro creado exitosamente:', resultado.data);
          setSubmitResult({
            success: true,
            message: 'Registro creado exitosamente'
          });
          Alert.alert('Éxito', 'El registro se ha creado correctamente', [
            {
              text: 'OK',
              onPress: () => {
                resetearFormulario();
              }
            }
          ]);
        } else {
          console.log('Error al crear registro:', resultado.error);
          
          let errorMessage = `Error: ${resultado.error}`;
          if (resultado.details && resultado.details.errors) {
            errorMessage += '\nDetalles:\n';
            Object.entries(resultado.details.errors).forEach(([campo, errores]) => {
              errorMessage += `- ${campo}: ${errores.join(', ')}\n`;
            });
          }
          
          setSubmitResult({
            success: false,
            message: errorMessage
          });
          
          // Si hay error en la API, guardar localmente
          await guardarRegistroPendiente(formData);
          const newCount = await contarRegistrosPendientes();
          setPendingCount(newCount);
          
          Alert.alert(
            'Error en el servidor',
            'Se ha guardado localmente y se sincronizará más tarde.',
            [
              {
                text: 'OK',
                onPress: () => {
                  resetearFormulario();
                }
              }
            ]
          );
        }
      } else {
        // Guardar localmente si no hay conexión
        await guardarRegistroPendiente(formData);
        const newCount = await contarRegistrosPendientes();
        setPendingCount(newCount);
        
        setSubmitResult({
          success: true,
          message: 'Registro guardado localmente. Se sincronizará cuando haya conexión.'
        });
        
        Alert.alert(
          'Registro Guardado Localmente',
          'No hay conexión a internet. Los datos se guardaron localmente y se sincronizarán cuando haya conexión.',
          [
            {
              text: 'OK',
              onPress: () => {
                resetearFormulario();
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error inesperado al enviar formulario:', error);
      
      setSubmitResult({
        success: false,
        message: `Error inesperado: ${error.message}`
      });
      
      // En caso de error, intentar guardar localmente
      try {
        await guardarRegistroPendiente(formData);
        const newCount = await contarRegistrosPendientes();
        setPendingCount(newCount);
        
        Alert.alert(
          'Error al Registrar',
          'Ocurrió un problema, pero los datos se guardaron localmente.',
          [
            {
              text: 'OK',
              onPress: () => {
                resetearFormulario();
              }
            }
          ]
        );
      } catch (localError) {
        Alert.alert('Error', `Error inesperado: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Función para resetear el formulario
  const resetearFormulario = () => {
    setNombre('');
    setApellidoPaterno('');
    setApellidoMaterno('');
    setDia('');
    setMes('');
    setAnio('');
    setFechaNacimiento('');
    setWhatsapp('');
    setCodigo('');
    setCodigoVerificacion('');
    setSeccion('');
    setSeccionElectoral('');
    setCalle('');
    setNumero('');
    setColonia('');
    setCP('');
    setCodigoPostal('');
    setFotoAnverso(null);
    setFotoReverso(null);
    setFotoIneAnverso(null);
    setFotoIneReverso(null);
    setSubmitResult(null);
    /*setDebugInfo('');*/
  };

  // Función para sincronizar
  const sincronizarPendientes = async () => {
    if (!isConnected) {
      Alert.alert(
        'Sin conexión',
        'No hay conexión a internet. Intente más tarde.'
      );
      return;
    }
    
    try {
      // Mostrar indicador de carga
      Alert.alert(
        'Sincronización',
        'Sincronizando registros pendientes...'
      );
      
      // Obtener registros pendientes
      const pendientes = await obtenerRegistrosPendientes();
      
      if (pendientes.length === 0) {
        Alert.alert(
          'Sincronización',
          'No hay registros pendientes para sincronizar.'
        );
        return;
      }
      
      // Importar el servicio de sincronización
      const { sincronizarRegistros } = require('../services/apiService');
      
      // Intentar sincronizar
      const resultado = await sincronizarRegistros(pendientes);
      
      if (resultado.success) {
        // Eliminar los registros sincronizados
        const idsAEliminar = pendientes
          .filter((_, index) => index < resultado.syncedCount)
          .map(item => item.tempId);
        
        await eliminarRegistrosPendientes(idsAEliminar);
        
        // Actualizar contador de pendientes
        const newCount = await contarRegistrosPendientes();
        setPendingCount(newCount);
        
        Alert.alert(
          'Sincronización Completada',
          `Se sincronizaron ${resultado.syncedCount || resultado.sincronizados} registros. ${resultado.failedCount || resultado.fallidos} fallaron.`
        );
      } else {
        Alert.alert(
          'Error de Sincronización',
          'Ocurrió un error al sincronizar. Intente más tarde.'
        );
      }
    } catch (error) {
      console.error('Error al sincronizar:', error);
      Alert.alert(
        'Error de Sincronización',
        'Ocurrió un error inesperado. Intente más tarde.'
      );
    }
  };

  // Monitorear estado de conexión y probar API al cargar
  useEffect(() => {
    // Monitorear conexión
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    
    // Probar API al cargar
    probarConexionAPI();
    
    // Solicitar permisos en móviles
    if (Platform.OS !== 'web') {
      (async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permisos insuficientes', 'Se necesita acceso a la galería para seleccionar imágenes');
        }
        
        const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
        if (cameraStatus.status !== 'granted') {
          Alert.alert('Permisos Insuficientes', 'Se necesita acceso a la cámara para tomar fotos de tu INE.');
        }
      })();
    }
    
    // Verificar registros pendientes al iniciar
    const checkPendingRegistros = async () => {
      const count = await contarRegistrosPendientes();
      setPendingCount(count);
    };
    
    checkPendingRegistros();
    
    return () => {
      unsubscribe();
    };
  }, []);

  // Componente para mostrar información de depuración
  const DebugInfo = () => {
    if (!debugInfo) return null;
    return (
      <View style={styles.debugContainer}>
        <Text style={styles.debugText}>{debugInfo}</Text>
      </View>
    );
  };

  // Detección de tipo de pantalla para decidir el layout a usar
  const [useCompactLayout, setUseCompactLayout] = useState(false);
  
  useEffect(() => {
    const updateLayout = () => {
      // En web, revisamos el ancho de la ventana
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        setUseCompactLayout(window.innerWidth < 768);
      }
    };
    
    updateLayout();
    
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.addEventListener('resize', updateLayout);
      return () => window.removeEventListener('resize', updateLayout);
    }
  }, []);

  // Renderizado condicional basado en si estamos usando los componentes originales o no
  const usingOriginalComponents = typeof NameSection !== 'undefined' && 
                                 typeof InfoGrid !== 'undefined' && 
                                 typeof AddressSection !== 'undefined' && 
                                 typeof INESection !== 'undefined';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>CORAZONES</Text>
            <Text style={styles.subtitle}>campaña de afiliación</Text>
          </View>
          
          <Image 
            source={require('../assets/images/LogoGAMhorizontalblanco.png')} 
            style={styles.logoImg}
            resizeMode="contain"
          />
        </View>
        
        <View style={styles.connectionStatus}>
          <View style={[styles.statusIndicator, isConnected ? styles.online : styles.offline]} />
          <Text style={styles.statusText}>{isConnected ? 'Conectado' : 'Sin conexión'}</Text>
          
          {pendingCount > 0 && (
            <View style={styles.pendingBadge}>
              <Text style={styles.pendingText}>{pendingCount}</Text>
            </View>
          )}
          
          <TouchableOpacity 
            style={styles.syncButton} 
            onPress={sincronizarPendientes}
          >
            <Text style={styles.syncButtonText}>Sincronizar</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={onLogout}
          >
            <Text style={styles.logoutButtonText}>Salir</Text>
          </TouchableOpacity>
          
          {/*          
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={probarConexionAPI}
          >
            <Text style={styles.retryButtonText}>Probar API</Text>
          </TouchableOpacity> */}
        </View>
      </View>
      
      <View style={styles.formContainer}>
        {usingOriginalComponents ? (
          // Usar los componentes originales si están disponibles
          <ScrollView contentContainerStyle={styles.formContent}>
            <NameSection 
              nombre={nombre}
              apellidoPaterno={apellidoPaterno}
              apellidoMaterno={apellidoMaterno}
              onChangeNombre={setNombre}
              onChangeApellidoPaterno={setApellidoPaterno}
              onChangeApellidoMaterno={setApellidoMaterno}
              apellidoPaternoDisabled={apellidoPaternoDisabled}
              apellidoMaternoDisabled={apellidoMaternoDisabled}
            />
            
            <InfoGrid 
              dia={dia}
              mes={mes}
              anio={anio}
              whatsapp={whatsapp}
              codigo={codigo}
              seccion={seccion}
              onChangeDia={setDia}
              onChangeMes={setMes}
              onChangeAnio={setAnio}
              onChangeWhatsapp={setWhatsapp}
              onChangeCodigo={setCodigo}
              onChangeSeccion={setSeccion}
              whatsappDisabled={whatsappDisabled}
              codigoDisabled={codigoDisabled}
              seccionDisabled={seccionDisabled}
            />
            
            <AddressSection 
              calle={calle}
              numero={numero}
              colonia={colonia}
              cp={cp}
              onChangeCalle={setCalle}
              onChangeNumero={setNumero}
              onChangeColonia={setColonia}
              onChangeCP={setCP}
              addressDisabled={addressDisabled}
            />
            
            <INESection 
              onPressAnverso={() => seleccionarImagen(setFotoAnverso)}
              onPressReverso={() => seleccionarImagen(setFotoReverso)}
              onPressCompletado={enviarFormulario}
              ineDisabled={ineDisabled}
              completadoDisabled={!formCompleto}
              fotoAnverso={fotoAnverso}
              fotoReverso={fotoReverso}
            />
            
            {/* Información de depuración */}
            <DebugInfo />
            
            {/* Resultado del envío */}
            {submitResult && (
              <View style={[
                styles.submitResultContainer,
                submitResult.success ? styles.submitSuccess : styles.submitError
              ]}>
                <Text style={styles.submitResultText}>{submitResult.message}</Text>
              </View>
            )}
          </ScrollView>
        ) : (
          // Implementación directa del formulario si los componentes no están disponibles
          <ScrollView>
            <View style={styles.apiTestContainer}>
              <Text style={styles.apiTestTitle}>Estado de la API</Text>
              <Text style={styles.apiResultText}>{apiStatus}</Text>
            </View>
            
            <View style={styles.testFormContainer}>
              <Text style={styles.testFormTitle}>Formulario de Registro</Text>
              
              {/* Información Personal */}
              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Información Personal</Text>
                
                <View style={styles.inputRow}>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Nombre</Text>
                    <TextInput
                      style={styles.input}
                      value={nombre}
                      onChangeText={setNombre}
                      placeholder="Nombre"
                    />
                  </View>
                  
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Apellido Paterno</Text>
                    <TextInput
                      style={styles.input}
                      value={apellidoPaterno}
                      onChangeText={setApellidoPaterno}
                      placeholder="Apellido Paterno"
                      editable={!apellidoPaternoDisabled}
                    />
                  </View>
                </View>
                
                <View style={styles.inputRow}>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Apellido Materno</Text>
                    <TextInput
                      style={styles.input}
                      value={apellidoMaterno}
                      onChangeText={setApellidoMaterno}
                      placeholder="Apellido Materno"
                      editable={!apellidoMaternoDisabled}
                    />
                  </View>
                  
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Fecha Nacimiento (YYYY-MM-DD)</Text>
                    <TextInput
                      style={styles.input}
                      value={fechaNacimiento}
                      onChangeText={setFechaNacimiento}
                      placeholder="YYYY-MM-DD"
                      editable={!apellidoMaternoDisabled}
                    />
                  </View>
                </View>
                
                <View style={styles.inputRow}>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>WhatsApp</Text>
                    <TextInput
                      style={styles.input}
                      value={whatsapp}
                      onChangeText={setWhatsapp}
                      placeholder="Número de WhatsApp"
                      keyboardType="phone-pad"
                      editable={!whatsappDisabled}
                      />
                      </View>
                  
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Código de Verificación</Text>
                    <TextInput
                      style={styles.input}
                      value={codigoVerificacion || codigo}
                      onChangeText={(text) => {
                        setCodigo(text);
                        setCodigoVerificacion(text);
                      }}
                      placeholder="Código de Verificación"
                      editable={!codigoDisabled}
                    />
                  </View>
                </View>
                
                <View style={styles.inputRow}>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Sección Electoral</Text>
                    <TextInput
                      style={styles.input}
                      value={seccionElectoral || seccion}
                      onChangeText={(text) => {
                        setSeccion(text);
                        setSeccionElectoral(text);
                      }}
                      placeholder="Sección Electoral"
                      keyboardType="number-pad"
                      editable={!seccionDisabled}
                    />
                  </View>
                </View>
              </View>
              
              {/* Dirección */}
              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Dirección</Text>
                
                <View style={styles.inputRow}>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Calle</Text>
                    <TextInput
                      style={styles.input}
                      value={calle}
                      onChangeText={setCalle}
                      placeholder="Calle"
                      editable={!addressDisabled}
                    />
                  </View>
                  
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Número</Text>
                    <TextInput
                      style={styles.input}
                      value={numero}
                      onChangeText={setNumero}
                      placeholder="Número"
                      editable={!addressDisabled}
                    />
                  </View>
                </View>
                
                <View style={styles.inputRow}>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Colonia</Text>
                    <TextInput
                      style={styles.input}
                      value={colonia}
                      onChangeText={setColonia}
                      placeholder="Colonia"
                      editable={!addressDisabled}
                    />
                  </View>
                  
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Código Postal</Text>
                    <TextInput
                      style={styles.input}
                      value={codigoPostal || cp}
                      onChangeText={(text) => {
                        setCP(text);
                        setCodigoPostal(text);
                      }}
                      placeholder="CP"
                      keyboardType="number-pad"
                      editable={!addressDisabled}
                    />
                  </View>
                </View>
              </View>
              
              {/* Imágenes INE */}
              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Imágenes de INE</Text>
                
                <View style={styles.imagesContainer}>
                  <View style={styles.imageSelector}>
                    <Text style={styles.imageLabel}>Foto Anverso (Frente)</Text>
                    <TouchableOpacity 
                      style={[
                        styles.selectImageButton,
                        ineDisabled && styles.selectImageButtonDisabled
                      ]}
                      onPress={async () => {
                        if (ineDisabled) return;
                        const fileName = await seleccionarImagen(setFotoIneAnverso);
                        if (fileName) {
                          Alert.alert('Éxito', `Imagen seleccionada: ${fileName}`);
                        }
                      }}
                      disabled={ineDisabled}
                    >
                      <Text style={styles.selectImageText}>
                        {fotoIneAnverso || fotoAnverso ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
                      </Text>
                    </TouchableOpacity>
                    {(fotoIneAnverso || fotoAnverso) && (
                      <Text style={styles.imageSelected}>
                        {Platform.OS === 'web' && (fotoIneAnverso || fotoAnverso) instanceof File
                          ? `Archivo: ${(fotoIneAnverso || fotoAnverso).name}` 
                          : 'Imagen seleccionada'}
                      </Text>
                    )}
                  </View>
                  
                  <View style={styles.imageSelector}>
                    <Text style={styles.imageLabel}>Foto Reverso (Atrás)</Text>
                    <TouchableOpacity 
                      style={[
                        styles.selectImageButton,
                        ineDisabled && styles.selectImageButtonDisabled
                      ]}
                      onPress={async () => {
                        if (ineDisabled) return;
                        const fileName = await seleccionarImagen(setFotoIneReverso);
                        if (fileName) {
                          Alert.alert('Éxito', `Imagen seleccionada: ${fileName}`);
                        }
                      }}
                      disabled={ineDisabled}
                    >
                      <Text style={styles.selectImageText}>
                        {fotoIneReverso || fotoReverso ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
                      </Text>
                    </TouchableOpacity>
                    {(fotoIneReverso || fotoReverso) && (
                      <Text style={styles.imageSelected}>
                        {Platform.OS === 'web' && (fotoIneReverso || fotoReverso) instanceof File
                          ? `Archivo: ${(fotoIneReverso || fotoReverso).name}` 
                          : 'Imagen seleccionada'}
                      </Text>
                    )}
                  </View>
                </View>
              </View>

              {/* Botón de envío */}
              <TouchableOpacity 
                style={[
                  styles.submitButton,
                  isSubmitting && styles.submitButtonDisabled,
                  !formCompleto ? styles.submitButtonDisabled : null
                ]}
                onPress={enviarFormulario}
                disabled={isSubmitting || !formCompleto}
              >
                <Text style={styles.submitButtonText}>
                  {isSubmitting ? 'Enviando...' : 'Completar Registro'}
                </Text>
              </TouchableOpacity>
              
              {/* Resultado del envío */}
              {submitResult && (
                <View style={[
                  styles.submitResultContainer,
                  submitResult.success ? styles.submitSuccess : styles.submitError
                ]}>
                  <Text style={styles.submitResultText}>{submitResult.message}</Text>
                </View>
              )}
              
              {/* Información de depuración */}
              <DebugInfo />
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Estilos básicos
  container: { 
    flex: 1, 
    backgroundColor: Colors.primary 
  },
  header: { 
    padding: 16, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between' 
  },
  logoContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 20 
  },
  textContainer: { 
    alignItems: 'center' 
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: Colors.white, 
    textTransform: 'uppercase', 
    lineHeight: 28 
  },
  subtitle: { 
    fontSize: 16, 
    color: Colors.white, 
    textTransform: 'lowercase' 
  },
  logoImg: { 
    height: 60, 
    width: 120
  },
  
  // Contenedor principal
  formContainer: { 
    flex: 1, 
    borderTopLeftRadius: 60, 
    overflow: 'hidden', 
    backgroundColor: Colors.background || '#f5f5f5' 
  },
  formContent: {
    padding: 25,
    paddingBottom: 50,
  },
  
  // Estado de conexión
  connectionStatus: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    padding: 5, 
    borderRadius: 20, 
    paddingHorizontal: 10 
  },
  statusIndicator: { 
    width: 12, 
    height: 12, 
    borderRadius: 6, 
    marginRight: 5 
  },
  online: { 
    backgroundColor: '#4CAF50' 
  },
  offline: { 
    backgroundColor: '#F44336' 
  },
  statusText: { 
    color: Colors.white, 
    fontSize: 12, 
    marginRight: 5 
  },
  
  // Botones de acción
  retryButton: { 
    backgroundColor: Colors.secondary || '#FF5722', 
    paddingHorizontal: 10, 
    paddingVertical: 5, 
    borderRadius: 15,
    marginLeft: 5
  },
  retryButtonText: { 
    color: Colors.white, 
    fontSize: 12 
  },
  syncButton: { 
    backgroundColor: Colors.secondary || '#FF5722', 
    paddingHorizontal: 10, 
    paddingVertical: 5, 
    borderRadius: 15 
  },
  syncButtonText: { 
    color: Colors.white, 
    fontSize: 12 
  },
  pendingBadge: {
    backgroundColor: Colors.error || '#F44336',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  pendingText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  
  // Contenedor de prueba API
  apiTestContainer: { 
    backgroundColor: 'white', 
    borderRadius: 10, 
    padding: 15, 
    margin: 20, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 3, 
    elevation: 2 
  },
  apiTestTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginBottom: 10 
  },
  apiResultText: { 
    fontSize: 14 
  },
  
  // Contenedor de formulario
  testFormContainer: { 
    backgroundColor: 'white', 
    borderRadius: 10, 
    padding: 20, 
    margin: 20, 
    marginTop: 0, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 3, 
    elevation: 2 
  },
  testFormTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 15, 
    textAlign: 'center' 
  },
  
  // Secciones del formulario
  formSection: { 
    marginBottom: 20, 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee', 
    paddingBottom: 15 
  },
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginBottom: 10, 
    color: Colors.primary || '#2196F3' 
  },
  
  // Campos de entrada
  inputRow: { 
    flexDirection: 'row', 
    marginBottom: 10, 
    flexWrap: 'wrap' 
  },
  inputWrapper: { 
    flex: 1, 
    minWidth: 250, 
    paddingRight: 10, 
    marginBottom: 10 
  },
  inputLabel: { 
    fontSize: 14, 
    marginBottom: 5, 
    color: '#555' 
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 5, 
    padding: 10, 
    fontSize: 14 
  },
  
  // Selectores de imagen
  imagesContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap' 
  },
  imageSelector: { 
    flex: 1, 
    minWidth: 250, 
    marginBottom: 15, 
    marginRight: 10 
  },
  imageLabel: { 
    fontSize: 14, 
    marginBottom: 5, 
    color: '#555' 
  },
  selectImageButton: { 
    backgroundColor: Colors.secondary || '#FF5722', 
    padding: 12, 
    borderRadius: 5, 
    alignItems: 'center' 
  },
  selectImageButtonDisabled: {
    backgroundColor: '#cccccc'
  },
  selectImageText: { 
    color: 'white', 
    fontWeight: 'bold' 
  },
  imageSelected: { 
    marginTop: 8, 
    fontSize: 12, 
    color: '#4CAF50' 
  },
  
  // Botón de envío
  submitButton: { 
    backgroundColor: Colors.primary || '#2196F3', 
    padding: 15, 
    borderRadius: 5, 
    alignItems: 'center', 
    marginTop: 20 
  },
  submitButtonDisabled: { 
    backgroundColor: '#cccccc' 
  },
  submitButtonText: { 
    color: 'white', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  
  // Resultado del envío
  submitResultContainer: { 
    padding: 15, 
    borderRadius: 5, 
    marginTop: 15 
  },
  submitSuccess: { 
    backgroundColor: '#E8F5E9', 
    borderColor: '#4CAF50', 
    borderWidth: 1 
  },
  submitError: { 
    backgroundColor: '#FFEBEE', 
    borderColor: '#F44336', 
    borderWidth: 1 
  },
  submitResultText: { 
    fontSize: 14 
  },
  
  // Información de depuración
  debugContainer: { 
    marginTop: 15, 
    padding: 10, 
    backgroundColor: '#f8f9fa', 
    borderRadius: 5, 
    borderWidth: 1, 
    borderColor: '#eaeaea' 
  },
  debugText: { 
    fontFamily: 'monospace', 
    fontSize: 12, 
    color: '#333' 
  },
  logoutButton: { 
    backgroundColor: Colors.error || '#F44336', 
    paddingHorizontal: 10, 
    paddingVertical: 5, 
    borderRadius: 15,
    marginLeft: 5
  },
  logoutButtonText: { 
    color: Colors.white, 
    fontSize: 12 
  },
});

export default RegistrationScreen;