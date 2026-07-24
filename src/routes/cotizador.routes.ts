import { Router } from 'express';
import { 
  cotizarYGuardarCliente, 
  descargarPdfCotizacionPorId, 
  obtenerClientesSeguimiento ,
  obtenerPaquetes,
  obtenerCotizacionPorId
} from '../controllers/cotizador.controller';

const router = Router();

router.post('/cotizar', cotizarYGuardarCliente);
router.get('/cotizacion/:id/pdf', descargarPdfCotizacionPorId);
router.get('/clientes', obtenerClientesSeguimiento);
router.get('/paquetes', obtenerPaquetes);
router.get('/cotizacion/:id', obtenerCotizacionPorId);

export default router;