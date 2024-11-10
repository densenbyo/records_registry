import { Request, Response } from 'express';
import { RecordsService } from '../service/RecordsService';
import {PrismaClient, Records} from '@prisma/client';
import { FileService } from "../service/FileService";

const prisma = new PrismaClient();

export class RecordsController {
    private recordsService: RecordsService;
    private fileService: FileService;

    constructor() {
        this.recordsService = new RecordsService();
        this.fileService = new FileService();
    }

    public async createRecord(req: Request, res: Response): Promise<void> {
        const { title, content, userId } = req.body;
        const file = req.file;

        try {
            const result = await prisma.$transaction(async () => {
                return await this.recordsService.createRecord(title, content, userId, file);
            });
            res.status(201).json(result);
        } catch (error) {
            console.error('Error during record creation.', error);
            try {
                await this.fileService.deleteFileFromLocal(file);
            } catch (error) {
                console.error('Error deleting file from local storage:', error);
            }
            res.status(500).json({ message: 'Server error' });
        }
    }

    public async findRecords(req: Request, res: Response): Promise<void> {
        const { recordIs } = req.body;
        try {
            const record:Records = await this.recordsService.getRecordsById(recordIs);
            res.status(200).json(record);
        } catch (error) {
            console.error(`Error during get record by id: ${recordIs}.`, error);
            res.status(500).json({message: 'Server error'});
        }
    }

    public async updateRecord(req: Request, res: Response): Promise<void> {
        const { recordId, title, content } = req.body;
        try {
            const record:Records = await this.recordsService.updateRecord(recordId, title, content);
            res.status(200).json(record);
        } catch (error) {
            console.error(`Error during update record by id: ${recordId}.`, error);
            res.status(500).json({message: 'Server error'});
        }
    }

    public async updateRecordState(req: Request, res: Response): Promise<void> {
        const { recordId, state } = req.body;
        try {
            const record:Records = await this.recordsService.updateRecordState(recordId, state);
            res.status(200).json(record);
        } catch (error) {
            console.error(`Error during update state of record by id: ${recordId}.`, error);
            res.status(500).json({message: 'Server error'});
        }
    }

    public async deleteRecord(req: Request, res: Response): Promise<void> {
        const { recordId } = req.body;
        try {
            const record:Records = await this.recordsService.deleteRecord(recordId);
            res.status(200).json(record);
        } catch (error) {
            console.error(`Error during deletion user by id: ${recordId}.`, error);
            res.status(500).json({message: 'Server error'});
        }
    }

    public async findUserRecords(req: Request, res: Response): Promise<void> {
        const { userId, page, pageSize, title, startDate, endDate } = req.body;
        try {
            const record:Records[] = await this.recordsService.getRecordsByUser(userId, page,
                pageSize, title, startDate, endDate);
            res.status(200).json(record);
        } catch (error) {
            console.error(`Error during get record by user's id: ${userId}.`, error);
            res.status(500).json({message: 'Server error'});
        }
    }
}