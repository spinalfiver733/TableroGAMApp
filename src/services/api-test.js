const axios = require('axios');

// URL base de la API
const API_URL = 'http://www.intranet.gamadero.cdmx.gob.mx/api-gam/public/api';

// Datos de prueba con el nombre correcto para el campo foto_ine_reverso
const testData = {
  nombre: "Prueba",
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
  fecha_registro: new Date().toISOString().split('T')[0]
};

// Función para probar la API
async function testAPI() {
  try {
    // 1. Probar GET
    console.log('==== PRUEBA GET /afiliados ====');
    const getResponse = await axios.get(`${API_URL}/afiliados`);
    console.log(`✅ GET exitoso. Registros obtenidos: ${getResponse.data.data.length}`);
    
    // 2. Probar POST
    console.log('\n==== PRUEBA POST /afiliados/store ====');
    console.log('Enviando datos:');
    Object.entries(testData).forEach(([key, value]) => {
      if (key.includes('foto')) {
        console.log(`  ${key}: [Base64 string]`);
      } else {
        console.log(`  ${key}: ${value}`);
      }
    });
    
    const postResponse = await axios.post(`${API_URL}/afiliados/store`, testData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('\n✅ POST exitoso!');
    console.log('Respuesta del servidor:');
    console.log(`  Status: ${postResponse.status}`);
    console.log(`  Mensaje: ${postResponse.data.message}`);
    console.log(`  ID generado: ${postResponse.data.data.id}`);
    
    console.log('\n==== PRUEBAS COMPLETADAS CON ÉXITO ====');
    
  } catch (error) {
    console.error('\n❌ ERROR EN LA PRUEBA:');
    console.error(`  Mensaje: ${error.message}`);
    
    if (error.response) {
      console.error(`  Status: ${error.response.status}`);
      console.error('  Detalles:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

// Ejecutar prueba
testAPI();