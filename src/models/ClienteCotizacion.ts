import { Schema, model, Document } from 'mongoose';

export interface IClienteCotizacion extends Document {
  nombreCliente: string;
  telefono: string;
  email: string;
  detallesCotizacion: {
    producto: string;
    genero: string;
    frecuencia: string;
    edad: number;
    montoAportacion: number;
    sumaAseguradaBasica: number;
  };
  estatusSeguimiento: 'NUEVO' | 'CONTACTADO' | 'COTIZADO' | 'CERRADO';
  fechaCreacion: Date;
}

const ClienteCotizacionSchema = new Schema<IClienteCotizacion>({
  nombreCliente: { type: String, required: true },
  telefono: { type: String, required: true },
  email: { type: String, required: true },
  detallesCotizacion: {
  producto: { type: String, required: true },
  genero: { type: String, required: true },
  frecuencia: { type: String, required: true },
  edad: { type: Number, required: true },
  montoAportacion: { type: Number, required: true },
  sumaAseguradaBasica: { type: Number, required: true },
  coberturas: { type: Object, required: false } // <--- Agregar este campo
},
  estatusSeguimiento: { 
    type: String, 
    enum: ['NUEVO', 'CONTACTADO', 'COTIZADO', 'CERRADO'], 
    default: 'NUEVO' 
  },
  fechaCreacion: { type: Date, default: Date.now }
});

export const ClienteCotizacionModel = model('ClienteCotizacion', ClienteCotizacionSchema, 'clientes_cotizaciones');