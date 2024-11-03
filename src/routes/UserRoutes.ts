import { UserController } from "../controller/UserController";
import { Router, Request, Response } from 'express';

const userController = new UserController();
const router: Router = Router();

router.get('/users/id', (req: Request, res: Response) => userController.findUser(req, res));
router.put('/users', (req: Request, res: Response) => userController.updateUser(req, res));
router.put('/users/role', (req: Request, res: Response) => userController.updateUserRole(req, res));
router.post('/users', (req: Request, res: Response) => userController.createUser(req, res));
router.delete('/users', (req: Request, res: Response) => userController.deleteUser(req, res));

export default router;