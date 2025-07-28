import { Router } from 'express';
import {
  createPatient,
  getAllPatients,
  getPatientById,
  addConsultation,
} from '../controllers/patientController';

const router = Router();

router.post('/', createPatient);
router.get('/', getAllPatients);
router.get('/:id', getPatientById);
router.post('/:id/consultations', addConsultation); // Endpoint pour ajouter une consultation [cite: 15]

export default router;