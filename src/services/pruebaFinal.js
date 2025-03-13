const axios = require('axios');

// URL base de la API
const API_URL = 'http://www.intranet.gamadero.cdmx.gob.mx/api-gam/public/api';

// Datos mínimos con una estructura más simple
const testData = {
  nombre: "Prueba Sin Timestamps",
  apellido_paterno: "API",
  apellido_materno: "Test",
  fecha_nacimiento: "2000-01-01",
  whatsapp: "5555555555",
  codigo_verificacion: "123456",
  seccion_electoral: "1234",
  calle: "Test",
  numero: "123",
  colonia: "Test",
  codigo_postal: "12345",
  foto_ine_anverso: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AVN//2Q==",
  foto_ine_reverso: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AVN//2Q==",
  fecha_registro: new Date().toISOString().split('T')[0],
  // Agregamos un campo para indicar al controlador que no use timestamps
  no_timestamps: true
}

// Función para probar POST
async function testPost() {
  try {
    console.log('Probando inserción sin timestamps...');
    
    const response = await axios.post(`${API_URL}/afiliados/store`, testData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ ÉXITO! Respuesta:', response.data);
    return true;
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    
    if (error.response) {
      console.error('  Status:', error.response.status);
      console.error('  Mensaje:', error.response.data.message || 'Sin mensaje');
      
      if (error.response.data.errors) {
        console.error('  Errores de validación:');
        Object.entries(error.response.data.errors).forEach(([campo, mensajes]) => {
          console.error(`    ${campo}: ${mensajes.join(', ')}`);
        });
      }
    }
    
    return false;
  }
}

// Ejecutar la prueba
testPost();