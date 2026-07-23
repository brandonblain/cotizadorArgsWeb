import { Schema, model } from 'mongoose';

// Definimos el esquema mapeando la estructura de tu colección 'paquetes'
const PaqueteSchema = new Schema(
  {
    _id: { type: String, required: true }, // El id es el string 'paq_730_731_t20', etc.
    codigo_producto: { type: String },
    nombre_paquete: { type: String },
    descripcion_temporalidad: { type: String },
    mercados: [{ type: String }],
    frecuencia_base: { type: String },
    aportaciones_disponibles: [{ type: Number }],
    coberturas: { type: Object } // Guarda la estructura flexible de las coberturas
  },
  {
    // Es clave especificar el nombre exacto de la colección en la base de datos
    collection: 'paquetes' 
  }
);

export const PaqueteModel = model('Paquete', PaqueteSchema);