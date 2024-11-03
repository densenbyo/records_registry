import { RecordsController } from "../controller/RecordsController";
import { Router, Request, Response } from 'express';

const recordsController = new RecordsController();
const router: Router = Router();

router.get('/records/id', (req: Request, res: Response) => recordsController.findRecords(req, res));
router.get('/records/user-id', (req: Request, res: Response) => recordsController.findUserRecords(req, res));
router.put('/records', (req: Request, res: Response) => recordsController.updateRecord(req, res));
router.put('/records/state', (req: Request, res: Response) => recordsController.updateRecordState(req, res));
router.post('/records', (req: Request, res: Response) => recordsController.createRecord(req, res));
router.delete('/records', (req: Request, res: Response) => recordsController.deleteRecord(req, res));

export default router;