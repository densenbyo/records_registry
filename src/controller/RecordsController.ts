import { Request, Response } from 'express';
import { RecordsService } from '../service/RecordsService';
import {PrismaClient, Records} from '@prisma/client';
import { FileService } from "../service/FileService";
import {StringToNumberValidator} from "../util/validators/StringToNumberValidator";

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

        if (!StringToNumberValidator.validate(userId)) {
            console.error('userId is not valid. It looks like \'abc\', but should look like \'123\'.');
            res.status(500).json({ message: 'Server error' });
        }

        const parsedUserId = parseInt(userId);

        try {

            const result = await prisma.$transaction(async () => {
                return await this.recordsService.createRecord(title, content, parsedUserId, file);
            });

            res.status(201).json(result);
        } catch (error) {
            console.error('Error during record creation.', error);
            if (file) {
                try {
                    await this.fileService.deleteFileFromLocal(file.path);
                } catch (error) {
                    console.error('Error deleting file from local storage:', error);
                }
            }
            res.status(500).json({ message: 'Server error' });
        }
    }

    public async findRecords(req: Request, res: Response): Promise<void> {
        const { recordIs } = req.body;
        try {
            if (!StringToNumberValidator.validate(recordIs)) {
                console.error('recordIs is not valid. It looks like \'abc\', but should look like \'123\'.');
                res.status(500).json({ message: 'Server error' });
            }

            const record:Records = await this.recordsService.getRecordsById(parseInt(recordIs));
            res.status(200).json(record);
        } catch (error) {
            console.error(`Error during get record by id: ${recordIs}.`, error);
            res.status(500).json({message: 'Server error'});
        }
    }

    public async updateRecord(req: Request, res: Response): Promise<void> {
        const { recordId, title, content } = req.body;
        try {
            if (!StringToNumberValidator.validate(recordId)) {
                console.error('recordId is not valid. It looks like \'abc\', but should look like \'123\'.');
                res.status(500).json({ message: 'Server error' });
            }

            const record:Records = await this.recordsService.updateRecord(parseInt(recordId), title, content);
            res.status(200).json(record);
        } catch (error) {
            console.error(`Error during update record by id: ${recordId}.`, error);
            res.status(500).json({message: 'Server error'});
        }
    }

    public async updateRecordState(req: Request, res: Response): Promise<void> {
        const { recordId, state } = req.body;
        try {
            if (!StringToNumberValidator.validate(recordId)) {
                console.error('recordId is not valid. It looks like \'abc\', but should look like \'123\'.');
                res.status(500).json({ message: 'Server error' });
            }

            const record:Records = await this.recordsService.updateRecordState(parseInt(recordId), state);
            res.status(200).json(record);
        } catch (error) {
            console.error(`Error during update state of record by id: ${recordId}.`, error);
            res.status(500).json({message: 'Server error'});
        }
    }

    public async deleteRecord(req: Request, res: Response): Promise<void> {
        const { recordId } = req.body;
        try {
            if (!StringToNumberValidator.validate(recordId)) {
                console.error('recordId is not valid. It looks like \'abc\', but should look like \'123\'.');
                res.status(500).json({ message: 'Server error' });
            }

            const record:Records = await this.recordsService.deleteRecord(parseInt(recordId));
            res.status(200).json(record);
        } catch (error) {
            console.error(`Error during deletion user by id: ${recordId}.`, error);
            res.status(500).json({message: 'Server error'});
        }
    }

    public async findUserRecords(req: Request, res: Response): Promise<void> {
        const { userId, page, pageSize, title, startDate, endDate } = req.body;
        try {
            if (!StringToNumberValidator.validate(userId) &&
                !StringToNumberValidator.validate(page) &&
                !StringToNumberValidator.validate(pageSize)) {
                console.error('userId or page or pageSize is not valid. It looks like \'abc\', but should look like \'123\'.');
                res.status(500).json({ message: 'Server error' });
            }

            const record:Records[] = await this.recordsService.getRecordsByUser(parseInt(userId), parseInt(page),
                parseInt(pageSize), title, startDate, endDate);

            res.status(200).json(record);
        } catch (error) {
            console.error(`Error during get record by user's id: ${userId}.`, error);
            res.status(500).json({message: 'Server error'});
        }
    }
}