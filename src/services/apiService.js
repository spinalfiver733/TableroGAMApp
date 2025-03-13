// src/services/apiService.js
import axios from "axios";

// URL base de la API
const API_URL = 'http://www.intranet.gamadero.cdmx.gob.mx/api-gam/public/api';

/**
 * Función para manejar errores de red y formatearlos
 * @param {Error} error - Error capturado
 * @returns {Object} Objeto de error formateado
 */
const handleError = (error) => {
  console.error('Error de API:', error);
  
  let errorMessage = 'Error al conectar con la API';
  let errorDetails = null;
  
  if (error.response) {
    console.log('Datos del error:', error.response.data);
    console.log('Estado del error:', error.response.status);
    console.log('Detalles completos del error:', JSON.stringify(error.response.data, null, 2));
    
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
    
    return {
      success: false,
      data: null,
      error: errorMessage,
      details: errorDetails
    };
  }
  
  // Si es un error de solicitud (no se pudo enviar la solicitud al servidor)
  if (error.request) {
    console.log('Petición sin respuesta:', error.request);
    return {
      success: false,
      data: null,
      error: 'No se pudo establecer conexión con el servidor',
      details: null
    };
  }
  
  // Cualquier otro tipo de error
  console.log('Mensaje de error:', error.message);
  return {
    success: false,
    data: null,
    error: error.message || 'Error desconocido',
    details: null
  };
};

/**
 * Verifica si hay conexión a Internet
 * @returns {Promise<boolean>} - True si hay conexión, false si no
 */
export const checkConnection = async () => {
  try {
    // Usamos Axios para verificar si podemos hacer una solicitud a la API
    await axios.head(`${API_URL}/afiliados`, {
      timeout: 5000
    });
    return true;
  } catch (error) {
    console.log('Error de conexión:', error);
    return false;
  }
};

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
    return handleError(error);
  }
};

/**
 * Obtiene un registro específico por ID
 * @param {number} id - ID del registro a obtener
 * @returns {Promise<Object>} Respuesta con el registro
 */
export const getRegistroById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/afiliados/${id}`);
    
    return {
      success: true,
      data: response.data,
      error: null
    };
  } catch (error) {
    return handleError(error);
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
 * Crea un nuevo registro de afiliado
 * @param {Object} datos - Datos del formulario 
 * @returns {Promise<Object>} Respuesta con el resultado
 */
export const crearRegistro = async (datos) => {
  try {
    console.log('Intentando crear nuevo registro...');
    
    // Determinar si estamos en web o móvil y formatear según corresponda
    if (Platform && Platform.OS !== 'web') {
      // ENFOQUE PARA MÓVIL
      // Convertir siempre a FormData para ser consistente
      const data = new FormData();
      
      // Mapeo explícito de todos los campos al formato que espera la API
      const camposAPI = {
        nombre: datos.nombre,
        apellido_paterno: datos.apellidoPaterno || datos.apellido_paterno,
        apellido_materno: datos.apellidoMaterno || datos.apellido_materno,
        fecha_nacimiento: datos.fechaNacimiento || datos.fecha_nacimiento || 
                          (datos.anio && datos.mes && datos.dia ? `${datos.anio}-${datos.mes}-${datos.dia}` : null),
        whatsapp: datos.whatsapp,
        codigo_verificacion: datos.codigo || datos.codigo_verificacion,
        seccion_electoral: datos.seccion || datos.seccion_electoral,
        calle: datos.calle,
        numero: datos.numero,
        colonia: datos.colonia,
        codigo_postal: datos.cp || datos.codigo_postal,
        fecha_registro: datos.fecha_registro || new Date().toISOString().split('T')[0]
      };
      
      // Añadir todos los campos de texto
      Object.entries(camposAPI).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          data.append(key, value);
        }
      });
      
      // Manejar imágenes si existen
      if (datos.fotoAnverso || datos.foto_ine_anverso) {
        const ineAnverso = datos.fotoAnverso || datos.foto_ine_anverso;
        
        if (ineAnverso && !ineAnverso.startsWith('http') && !ineAnverso.startsWith('data:')) {
          const uriParts = ineAnverso.split('/');
          const fileName = uriParts[uriParts.length - 1];
          
          const file = {
            uri: ineAnverso,
            name: fileName,
            type: 'image/jpeg'
          };
          
          data.append('foto_ine_anverso', file);
        } else if (ineAnverso && (ineAnverso.startsWith('data:') || ineAnverso.startsWith('http'))) {
          // Si ya es base64 o URL
          data.append('foto_ine_anverso', ineAnverso);
        }
      }
      
      if (datos.fotoReverso || datos.foto_ine_reverso) {
        const ineReverso = datos.fotoReverso || datos.foto_ine_reverso;
        
        if (ineReverso && !ineReverso.startsWith('http') && !ineReverso.startsWith('data:')) {
          const uriParts = ineReverso.split('/');
          const fileName = uriParts[uriParts.length - 1];
          
          const file = {
            uri: ineReverso,
            name: fileName,
            type: 'image/jpeg'
          };
          
          data.append('foto_ine_reverso', file);
        } else if (ineReverso && (ineReverso.startsWith('data:') || ineReverso.startsWith('http'))) {
          // Si ya es base64 o URL
          data.append('foto_ine_reverso', ineReverso);
        }
      }
      
      // Imprimir lo que estamos enviando para depuración
      console.log('Enviando datos:', Array.from(data.entries()).reduce((obj, [key, value]) => {
        obj[key] = typeof value === 'object' ? '[File object]' : value;
        return obj;
      }, {}));
      
      const response = await axios.post(`${API_URL}/afiliados/store`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      console.log('Respuesta exitosa de la API:', response.data);
      
      return {
        success: response.status >= 200 && response.status < 300,
        data: response.data,
        error: null
      };
    } else {
      // ENFOQUE PARA WEB
      console.log('Intentando crear nuevo registro como JSON...');
      
      // Preparar un objeto para el envío JSON
      const datosEnvio = {
        nombre: datos.nombre,
        apellido_paterno: datos.apellidoPaterno || datos.apellido_paterno,
        apellido_materno: datos.apellidoMaterno || datos.apellido_materno,
        fecha_nacimiento: datos.fechaNacimiento || datos.fecha_nacimiento || 
                          (datos.anio && datos.mes && datos.dia ? `${datos.anio}-${datos.mes}-${datos.dia}` : null),
        whatsapp: datos.whatsapp,
        codigo_verificacion: datos.codigo || datos.codigo_verificacion,
        seccion_electoral: datos.seccion || datos.seccion_electoral,
        calle: datos.calle,
        numero: datos.numero,
        colonia: datos.colonia,
        codigo_postal: datos.cp || datos.codigo_postal,
        fecha_registro: datos.fecha_registro || new Date().toISOString().split('T')[0]
      };
      
      // Procesar las imágenes como strings base64
      if (datos.fotoAnverso || datos.foto_ine_anverso) {
        const ineAnverso = datos.fotoAnverso || datos.foto_ine_anverso;
        
        if (ineAnverso instanceof File || ineAnverso instanceof Blob) {
          console.log('Convirtiendo foto anverso de File a base64...');
          datosEnvio.foto_ine_anverso = await fileToBase64(ineAnverso);
        } else {
          // Ya es una string (URI o base64)
          datosEnvio.foto_ine_anverso = ineAnverso;
        }
      }
      
      if (datos.fotoReverso || datos.foto_ine_reverso) {
        const ineReverso = datos.fotoReverso || datos.foto_ine_reverso;
        
        if (ineReverso instanceof File || ineReverso instanceof Blob) {
          console.log('Convirtiendo foto reverso de File a base64...');
          datosEnvio.foto_ine_reverso = await fileToBase64(ineReverso);
        } else {
          // Ya es una string (URI o base64)
          datosEnvio.foto_ine_reverso = ineReverso;
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
    }
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Actualiza un registro existente
 * @param {number} id - ID del registro a actualizar
 * @param {Object} formData - Datos actualizados
 * @returns {Promise<Object>} Respuesta con el resultado de la operación
 */
export const actualizarRegistro = async (id, formData) => {
  try {
    // Determinar si hay imágenes para saber si usar FormData o JSON
    const hasImages = formData.fotoAnverso || formData.foto_ine_anverso || 
                      formData.fotoReverso || formData.foto_ine_reverso;
    
    if (hasImages && Platform && Platform.OS !== 'web') {
      // Enfoque para móvil con imágenes
      const data = new FormData();
      
      // Añadir todos los campos excepto imágenes
      Object.keys(formData).forEach(key => {
        if (key !== 'fotoAnverso' && key !== 'fotoReverso' && 
            key !== 'foto_ine_anverso' && key !== 'foto_ine_reverso') {
          data.append(key, formData[key]);
        }
      });
      
      // Manejar foto anverso
      if (formData.fotoAnverso || formData.foto_ine_anverso) {
        const ineAnverso = formData.fotoAnverso || formData.foto_ine_anverso;
        
        if (ineAnverso && !ineAnverso.startsWith('http') && !ineAnverso.startsWith('data:')) {
          const uriParts = ineAnverso.split('/');
          const fileName = uriParts[uriParts.length - 1];
          
          const file = {
            uri: ineAnverso,
            name: fileName,
            type: 'image/jpeg'
          };
          
          data.append('foto_ine_anverso', file);
        } else if (ineAnverso && (ineAnverso.startsWith('data:') || ineAnverso.startsWith('http'))) {
          data.append('foto_ine_anverso', ineAnverso);
        }
      }
      
      // Manejar foto reverso
      if (formData.fotoReverso || formData.foto_ine_reverso) {
        const ineReverso = formData.fotoReverso || formData.foto_ine_reverso;
        
        if (ineReverso && !ineReverso.startsWith('http') && !ineReverso.startsWith('data:')) {
          const uriParts = ineReverso.split('/');
          const fileName = uriParts[uriParts.length - 1];
          
          const file = {
            uri: ineReverso,
            name: fileName,
            type: 'image/jpeg'
          };
          
          data.append('foto_ine_reverso', file);
        } else if (ineReverso && (ineReverso.startsWith('data:') || ineReverso.startsWith('http'))) {
          data.append('foto_ine_reverso', ineReverso);
        }
      }
      
      const response = await axios.put(`${API_URL}/afiliados/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      
      return {
        success: true,
        data: response.data,
        error: null
      };
    } else if (hasImages) {
      // Enfoque para web con imágenes (como JSON con base64)
      const datosEnvio = { ...formData };
      
      // Procesar las imágenes como strings base64
      if (formData.fotoAnverso || formData.foto_ine_anverso) {
        const ineAnverso = formData.fotoAnverso || formData.foto_ine_anverso;
        
        if (ineAnverso instanceof File || ineAnverso instanceof Blob) {
          datosEnvio.foto_ine_anverso = await fileToBase64(ineAnverso);
          delete datosEnvio.fotoAnverso;
        } else {
          // Ya es una string (URI o base64)
          datosEnvio.foto_ine_anverso = ineAnverso;
          delete datosEnvio.fotoAnverso;
        }
      }
      
      if (formData.fotoReverso || formData.foto_ine_reverso) {
        const ineReverso = formData.fotoReverso || formData.foto_ine_reverso;
        
        if (ineReverso instanceof File || ineReverso instanceof Blob) {
          datosEnvio.foto_ine_reverso = await fileToBase64(ineReverso);
          delete datosEnvio.fotoReverso;
        } else {
          // Ya es una string (URI o base64)
          datosEnvio.foto_ine_reverso = ineReverso;
          delete datosEnvio.fotoReverso;
        }
      }
      
      const response = await axios.put(`${API_URL}/afiliados/${id}`, datosEnvio, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      return {
        success: true,
        data: response.data,
        error: null
      };
    } else {
      // Sin imágenes, enviamos como JSON
      const response = await axios.put(`${API_URL}/afiliados/${id}`, formData, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      return {
        success: true,
        data: response.data,
        error: null
      };
    }
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Elimina un registro existente
 * @param {number} id - ID del registro a eliminar
 * @returns {Promise<Object>} Respuesta con el resultado de la operación
 */
export const eliminarRegistro = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/afiliados/${id}`);
    
    return {
      success: true,
      data: response.data,
      error: null
    };
  } catch (error) {
    return handleError(error);
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
      syncedCount: 0,
      failedCount: 0,
      sincronizados: 0,
      fallidos: 0,
      errores: []
    };
    
    for (const registro of pendientes) {
      try {
        const resultado = await crearRegistro(registro);
        
        if (resultado.success) {
          resultados.syncedCount++;
          resultados.sincronizados++;
        } else {
          resultados.failedCount++;
          resultados.fallidos++;
          resultados.errores.push({
            registro,
            error: resultado.error
          });
        }
      } catch (error) {
        resultados.failedCount++;
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
      syncedCount: 0,
      failedCount: pendientes.length,
      sincronizados: 0,
      fallidos: pendientes.length,
      error: error.message,
      errores: [{error: error.message}]
    };
  }
};

// Importación condicional para Platform
let Platform;
try {
  Platform = require('react-native').Platform;
} catch (e) {
  // En caso de error, crear un objeto Platform ficticio
  Platform = {
    OS: 'web',
    select: function(obj) {
      return obj.web || obj.default;
    }
  };
}