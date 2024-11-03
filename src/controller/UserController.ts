import { Request, Response } from 'express';
import { UserService } from '../service/UserService';
import { User } from '@prisma/client';

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    public async createUser(req: Request, res: Response): Promise<void> {
        const { username, email, age } = req.body;
        try {
            const user: User = await this.userService.createUser(username, email, age);
            res.status(201).json(user);
        } catch (error) {
            console.error('Error during user creation.', error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    public async findUser(req: Request, res: Response): Promise<void> {
        const {userId} = req.body;
        try {
            const user:User = await this.userService.getUserById(userId);
            res.status(200).json(user);
        } catch (error) {
            console.error(`Error during get user by id: ${userId}.`, error);
            res.status(500).json({message: 'Server error'});
        }
    }

    public async updateUser(req: Request, res: Response): Promise<void> {
        const {userId, username, email, age} = req.body;
        try {
            const user:User = await this.userService.updateUser(userId, username, email, age);
            res.status(200).json(user);
        } catch (error) {
            console.error(`Error during update user by id: ${userId}.`, error);
            res.status(500).json({message: 'Server error'});
        }
    }

    public async updateUserRole(req: Request, res: Response): Promise<void> {
        const {userId, role} = req.body;
        try {
            const user:User = await this.userService.updateUserRole(userId, role);
            res.status(200).json(user);
        } catch (error) {
            console.error(`Error during update role of user by id: ${userId}.`, error);
            res.status(500).json({message: 'Server error'});
        }
    }

    public async deleteUser(req: Request, res: Response): Promise<void> {
        const {userId} = req.body;
        try {
            const user:User = await this.userService.deleteUser(userId);
            res.status(200).json(user);
        } catch (error) {
            console.error(`Error during deletion user by id: ${userId}.`, error);
            res.status(500).json({message: 'Server error'});
        }
    }
}