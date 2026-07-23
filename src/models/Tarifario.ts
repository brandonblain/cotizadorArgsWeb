import { Schema, model, Document } from 'mongoose';

export interface ITarifario extends Document {
  paquete_id: string;
  genero: string;
  frecuencia: string;
  edad: number;
  tarifas: Record<string, number>;
}

const TarifarioSchema = new Schema<ITarifario>({
  paquete_id: { type: String, required: true, index: true },
  genero: { type: String, required: true, index: true },
  frecuencia: { type: String, required: true },
  edad: { type: Number, required: true, index: true },
  tarifas: { type: Map, of: Number, required: true }
});

export const TarifarioModel = model<ITarifario>('Tarifario', TarifarioSchema, 'matriz_tarifaria');