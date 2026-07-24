import { Router } from 'express';
import { 
  cotizarYGuardarCliente, 
  descargarPdfCotizacionPorId, 
  obtenerClientesSeguimiento ,
  obtenerPaquetes
} from '../controllers/cotizador.controller';

const router = Router();

router.post('/cotizar', cotizarYGuardarCliente);
router.get('/cotizacion/:id/pdf', descargarPdfCotizacionPorId);
router.get('/clientes', obtenerClientesSeguimiento);
router.get('/paquetes', obtenerPaquetes);

export default router;