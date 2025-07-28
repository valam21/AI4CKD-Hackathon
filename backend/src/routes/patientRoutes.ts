import { Router } from 'express';
import {
  createPatient,
  getAllPatients,
  getPatientById,
  addConsultation,
  exportPatientPdf,
} from '../controllers/patientController';

const router = Router();

router.post('/', createPatient);
router.get('/', getAllPatients);
router.get('/:id', getPatientById);
router.post('/:id/consultations', addConsultation); // Endpoint pour ajouter une consultation [cite: 15]
router.get('/:id/pdf', exportPatientPdf);

export default router;