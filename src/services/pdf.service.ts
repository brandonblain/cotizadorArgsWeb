import PDFDocument from 'pdfkit';
import { Response } from 'express';

// Permitir cualquier estructura dentro de cada cobertura para evitar errores de TypeScript
interface CoberturasPDF {
  [key: string]: {
    suma_asegurada?: number;
    incluido?: boolean;
    incluida?: boolean;
    edad_min?: number;
    edad_max?: number;
    [key: string]: any;
  };
}

interface DatosPDF {
  nombreCliente: string;
  telefono: string;
  email: string;
  producto: string;
  genero: string;
  frecuencia: string;
  edad: number;
  montoAportacion: number;
  sumaAseguradaBasica: number;
  coberturas?: CoberturasPDF;
}

export const generarPdfCotizacion = (datos: DatosPDF, res: Response) => {
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=cotizacion_${datos.nombreCliente.replace(/\s+/g, '_')}.pdf`
  );

  doc.pipe(res);

  // --- ENCABEZADO ---
  doc.fontSize(20).fillColor('#1E3A8A').text('SEGUROS ARGOS', { align: 'center' });
  doc.fontSize(12).fillColor('#555555').text('Cotización Oficial - Plan de Protección', { align: 'center' });
  doc.moveDown(1.5);

  // --- DATOS DEL CLIENTE ---
  doc.fontSize(13).fillColor('#000000').text('Datos del Asegurado', { underline: true });
  doc.fontSize(10).fillColor('#333333');
  doc.text(`Nombre: ${datos.nombreCliente}`);
  doc.text(`Teléfono: ${datos.telefono}`);
  doc.text(`Correo Electrónico: ${datos.email}`);
  doc.moveDown(1);

  // --- DETALLES DE LA COTIZACIÓN ---
  doc.fontSize(13).fillColor('#000000').text('Detalles del Plan', { underline: true });
  doc.fontSize(10).fillColor('#333333');
  doc.text(`Paquete ID: ${datos.producto}`);
  doc.text(`Género: ${datos.genero} | Edad: ${datos.edad} años | Frecuencia: ${datos.frecuencia}`);
  doc.text(`Aportación: $${datos.montoAportacion?.toLocaleString()}`);
  doc.text(`Suma Asegurada Básica: $${datos.sumaAseguradaBasica?.toLocaleString()}`);
  doc.moveDown(1);

  // --- COBERTURAS Y BENEFICIOS ---
  doc.fontSize(14).fillColor('#111827').text('Coberturas Incluidas', { underline: true });
  doc.moveDown(0.5);

  // Leemos directamente 'datos.coberturas'
  const coberturas = datos.coberturas;

  if (coberturas && typeof coberturas === 'object') {
    Object.entries(coberturas).forEach(([key, value]: [string, any]) => {
      // Formatear el nombre de la cobertura (ej. "basica_fallecimiento" -> "Basica Fallecimiento")
      const nombreFormateado = key
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());

      let detalleTexto = '';

      // Evaluar las propiedades de la cobertura
      if (value.suma_asegurada) {
        detalleTexto = `Suma Asegurada: $${value.suma_asegurada.toLocaleString()}`;
      } else if (value.incluido || value.incluida) {
        detalleTexto = 'Incluido';
      } else if (value.edad_min && value.edad_max) {
        detalleTexto = `Aplica de ${value.edad_min} a ${value.edad_max} años`;
      } else {
        detalleTexto = 'Cubierto';
      }

      doc
        .fontSize(10)
        .fillColor('#1F2937')
        .text(`• ${nombreFormateado}: `, { continued: true })
        .fillColor('#4B5563')
        .text(detalleTexto);
    });
  } else {
    doc.fontSize(10).fillColor('#6B7280').text('No hay coberturas especificadas.');
  }

  // --- PIE DE PÁGINA ---
  doc.moveDown(4);
  doc.fontSize(8).fillColor('#9CA3AF').text('Este documento es una cotización informativa y no representa un contrato de seguro definitivo.', { align: 'center' });

  doc.end();
};