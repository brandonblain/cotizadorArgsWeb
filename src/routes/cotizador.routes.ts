import { Router } from 'express';
import { 
  cotizarYGuardarCliente, 
  descargarPdfCotizacionPorId, 
  obtenerClientesSeguimiento 
} from '../controllers/cotizador.controller';

const router = Router();

router.post('/cotizar', cotizarYGuardarCliente);
router.get('/cotizacion/:id/pdf', descargarPdfCotizacionPorId);
router.get('/clientes', obtenerClientesSeguimiento);

export default router;