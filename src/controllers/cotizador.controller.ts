import { Request, Response } from 'express';
import { TarifarioModel } from '../models/Tarifario';
import { ClienteCotizacionModel } from '../models/ClienteCotizacion';
import { PaqueteModel } from '../models/paquete.model';
import { generarPdfCotizacion } from '../services/pdf.service';
import PDFDocument from 'pdfkit';

export const cotizarYGuardarCliente = async (req: Request, res: Response) => {
  try {
    const { 
      nombreCliente, 
      telefono, 
      email, 
      paquete_id, 
      genero, 
      frecuencia, 
      edad, 
      montoAportacion 
    } = req.body;

    // 1. Buscar la tarifa en MongoDB Atlas
    const registroTarifa = await TarifarioModel.findOne({
      paquete_id: paquete_id.trim(),
      genero: genero.trim().toUpperCase(),
      frecuencia: frecuencia.trim().toUpperCase(),
      edad: Number(edad)
    });

    const paqueteInfo = await PaqueteModel.findById(paquete_id);
    const coberturas = paqueteInfo ? paqueteInfo.coberturas : {};

    console.log("Registro encontrado en DB:", registroTarifa); // <-- Agrega esto

    if (!registroTarifa) {
      return res.status(404).json({ error: 'No se encontró una tarifa para los parámetros especificados.' });
    }

    const tarifasObj = (registroTarifa.tarifas as any) || {};
    console.log("Tarifas disponibles en el objeto:", tarifasObj); // <-- Y esto
    console.log("Buscando monto:", montoAportacion.toString()); // <-- Y esto

    const sumaAseguradaBasica = tarifasObj[montoAportacion.toString()] || tarifasObj.get?.(montoAportacion.toString());
    if (!sumaAseguradaBasica) {
      return res.status(400).json({ error: 'El monto de aportación seleccionado no es válido para esta edad/paquete.' });
    }

    // 2. Guardar el registro del cliente en la base de datos para seguimiento
    const nuevoCliente = await ClienteCotizacionModel.create({
      nombreCliente,
      telefono,
      email,
      detallesCotizacion: {
        producto: paquete_id,
        genero,
        frecuencia,
        edad,
        montoAportacion,
        sumaAseguradaBasica,
        coberturas: coberturas || {} 
      },
      estatusSeguimiento: 'COTIZADO'
    });

    return res.status(200).json({
      message: 'Cotización exitosa y cliente registrado para seguimiento',
      clienteId: nuevoCliente._id,
      cotizacion: {
        sumaAseguradaBasica,
        montoAportacion,
        frecuencia,
        producto: paquete_id
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error interno del servidor al procesar la cotización.' });
  }
};

export const obtenerClientesSeguimiento = async (req: Request, res: Response) => {
  try {
    const clientes = await ClienteCotizacionModel.find().sort({ fechaCreacion: -1 });
    return res.status(200).json(clientes);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener los clientes.' });
  }
};

export const descargarPdfCotizacionPorId = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Buscar el cliente y su cotización guardada en la base de datos
    const clienteCotizacion = await ClienteCotizacionModel.findById(id);

    if (!clienteCotizacion) {
      return res.status(404).json({ error: 'No se encontró la cotización con el ID proporcionado.' });
    }

    const { nombreCliente, telefono, email, detallesCotizacion } = clienteCotizacion;

    // Mapear los datos hacia la estructura que espera el servicio de PDF
    const datosPDF = {
  nombreCliente: clienteCotizacion.nombreCliente,
  telefono: clienteCotizacion.telefono,
  email: clienteCotizacion.email,
  producto: clienteCotizacion.detallesCotizacion.producto,
  genero: clienteCotizacion.detallesCotizacion.genero,
  frecuencia: clienteCotizacion.detallesCotizacion.frecuencia,
  edad: clienteCotizacion.detallesCotizacion.edad,
  montoAportacion: clienteCotizacion.detallesCotizacion.montoAportacion,
  sumaAseguradaBasica: clienteCotizacion.detallesCotizacion.sumaAseguradaBasica,
  coberturas: (clienteCotizacion.detallesCotizacion as any)?.coberturas
};

    // Generar y enviar el PDF como respuesta para descarga
    generarPdfCotizacion(datosPDF, res);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error interno al generar el PDF de la cotización.' });
  }
};