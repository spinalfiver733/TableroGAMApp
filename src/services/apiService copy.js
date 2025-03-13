// src/services/apiService.js
import axios from "axios";

// URL base de tu API PHP Laravel
const API_URL = 'http://www.intranet.gamadero.cdmx.gob.mx/api-gam/public/api';

/**
 * Obtiene todos los registros de afiliados
 * @returns {Promise<Object>} Respuesta con los registros
 */
export const getRegistros = async () => {
  try {
    console.log('Intentando obtener datos de la API...');
    
    const response = await axios.get(`${API_URL}/afiliados`);
    
    console.log('Datos recibidos de la API:', response.data);
    
    return {
      success: true,
      data: response.data,
      error: null
    };
  } catch (error) {
    console.error('Error al obtener datos de la API:', error);
    
    let errorMessage = 'Error al conectar con la API';
    
    if (error.response) {
      console.log('Datos del error:', error.response.data);
      console.log('Estado del error:', error.response.status);
      errorMessage = `Error ${error.response.status}: ${error.response.statusText || 'Error del servidor'}`;
    } else if (error.request) {
      console.log('Petición sin respuesta:', error.request);
      errorMessage = 'No se recibió respuesta del servidor';
    } else {
      console.log('Mensaje de error:', error.message);
      errorMessage = error.message;
    }
    
    return {
      success: false,
      data: null,
      error: errorMessage
    };
  }
};

/**
 * Convierte un archivo o blob a base64
 * @param {File|Blob} file - Archivo a convertir
 * @returns {Promise<string>} - Cadena en formato base64
 */
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Crea un nuevo registro de afiliado (enviando todo como JSON)
 * @param {Object} datos - Datos del formulario 
 * @returns {Promise<Object>} Respuesta con el resultado
 */
export const crearRegistro = async (datos) => {
  try {
    console.log('Intentando crear nuevo registro como JSON...');
    
    // Preparar un objeto para el envío JSON (no FormData)
    const datosEnvio = {
      nombre: datos.nombre,
      apellido_paterno: datos.apellido_paterno,
      apellido_materno: datos.apellido_materno,
      fecha_nacimiento: datos.fecha_nacimiento,
      whatsapp: datos.whatsapp,
      codigo_verificacion: datos.codigo_verificacion,
      seccion_electoral: datos.seccion_electoral,
      calle: datos.calle,
      numero: datos.numero,
      colonia: datos.colonia,
      codigo_postal: datos.codigo_postal,
      fecha_registro: datos.fecha_registro
    };
    
    // Procesar las imágenes como strings base64
    if (datos.foto_ine_anverso) {
      if (datos.foto_ine_anverso instanceof File || datos.foto_ine_anverso instanceof Blob) {
        console.log('Convirtiendo foto anverso de File a base64...');
        datosEnvio.foto_ine_anverso = await fileToBase64(datos.foto_ine_anverso);
      } else {
        // Ya es una string (URI o base64)
        datosEnvio.foto_ine_anverso = datos.foto_ine_anverso;
      }
    }
    
    if (datos.foto_ine_reverso) {
      if (datos.foto_ine_reverso instanceof File || datos.foto_ine_reverso instanceof Blob) {
        console.log('Convirtiendo foto reverso de File a base64...');
        datosEnvio.foto_ine_reverso = await fileToBase64(datos.foto_ine_reverso);
      } else {
        // Ya es una string (URI o base64)
        datosEnvio.foto_ine_reverso = datos.foto_ine_reverso;
      }
    }
    
    // Mostrar los campos que vamos a enviar
    console.log('Enviando JSON a la API:');
    Object.keys(datosEnvio).forEach(key => {
      if (key.startsWith('foto_')) {
        console.log(`${key}: [String base64]`);
      } else {
        console.log(`${key}: ${datosEnvio[key]}`);
      }
    });
    
    // Realizar la petición HTTP POST como JSON
    const config = {
      headers: {
        'Content-Type': 'application/json',
      }
    };
    
    const response = await axios.post(`${API_URL}/afiliados/store`, datosEnvio, config);
    
    console.log('Respuesta exitosa de la API:', response.data);
    
    return {
      success: true,
      data: response.data,
      error: null
    };
  } catch (error) {
    console.error('Error al crear registro:', error);
    
    let errorMessage = 'Error al crear registro';
    let errorDetails = null;
    
    if (error.response) {
      console.log('Datos del error:', error.response.data);
      console.log('Estado del error:', error.response.status);
      errorMessage = `Error ${error.response.status}: ${error.response.statusText || 'Error del servidor'}`;
      errorDetails = error.response.data;
      
      // Mostrar detalles adicionales para errores
      if (error.response.status === 500) {
        console.log('Error 500 (Error interno del servidor)');
        if (error.response.data && error.response.data.message) {
          console.log('Mensaje del error:', error.response.data.message);
        }
      }
      
      // Mostrar errores de validación
      if (error.response.data && error.response.data.errors) {
        console.log('Errores de validación:', error.response.data.errors);
        console.log('Detalles de errores:');
        Object.entries(error.response.data.errors).forEach(([campo, errores]) => {
          console.log(` ${campo}: ${errores.join(', ')}`);
        });
      }
    } else if (error.request) {
      console.log('Petición sin respuesta:', error.request);
      errorMessage = 'No se recibió respuesta del servidor';
    } else {
      console.log('Mensaje de error:', error.message);
      errorMessage = error.message;
    }
    
    return {
      success: false,
      data: null,
      error: errorMessage,
      details: errorDetails
    };
  }
};

/**
 * Sincroniza registros pendientes
 * @param {Array} pendientes - Registros pendientes a sincronizar
 * @returns {Promise<Object>} Resultado de la sincronización
 */
export const sincronizarRegistros = async (pendientes) => {
  try {
    const resultados = {
      success: true,
      sincronizados: 0,
      fallidos: 0,
      errores: []
    };
    
    for (const registro of pendientes) {
      try {
        const resultado = await crearRegistro(registro);
        
        if (resultado.success) {
          resultados.sincronizados++;
        } else {
          resultados.fallidos++;
          resultados.errores.push({
            registro,
            error: resultado.error
          });
        }
      } catch (error) {
        resultados.fallidos++;
        resultados.errores.push({
          registro,
          error: error.message
        });
      }
    }
    
    return resultados;
  } catch (error) {
    console.error('Error al sincronizar registros:', error);
    
    return {
      success: false,
      sincronizados: 0,
      fallidos: pendientes.length,
      error: error.message
    };
  }
};

// Función auxiliar para verificar la conexión
export const checkConnection = async () => {
  try {
    await axios.head(`${API_URL}/afiliados`, { timeout: 5000 });
    return true;
  } catch (error) {
    console.error('Error de conexión:', error);
    return false;
  }
};