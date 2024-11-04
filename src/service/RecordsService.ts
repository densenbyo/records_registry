import { RecordsRepository } from "../repository/RecordsRepository";
import { Records, State, User } from '@prisma/client';
import { UserService } from "./UserService";
import { FileService } from "./FileService";

export class RecordsService {
    private recordsRepository: RecordsRepository;
    private userService: UserService;
    private fileService: FileService;

    constructor() {
        this.recordsRepository = new RecordsRepository();
        this.userService = new UserService();
        this.fileService = new FileService();
    }

    public async createRecord(title: string, content: string, userId: number, file: Express.Multer.File | undefined): Promise<Records> {
        const user:User = await this.userService.getUserById(userId);
        const record: Records = await this.recordsRepository.create(title, content, userId, user.username);

        if (file) {
            await this.fileService.createFile({
                fileUrl: file.path,
                userId: userId,
                recordId: record.id,
            });
        }

        return record;
    }

    public async getRecordsById(recordId: number): Promise<Records> {
        const record = await this.recordsRepository.findRecordById(recordId);

        if (record == null) {
            throw new Error(`Record with id: ${recordId} is not found.`);
        }
        return record;
    }

    public async updateRecord(recordId: number, title: string, content: string): Promise<Records> {
        const updateRecord = await this.recordsRepository.update(recordId, title, content);

        if (updateRecord == null) {
            throw new Error(`Record with id: ${recordId} is not found. Rolling back update action.`)
        }
        return updateRecord;
    }

    public async updateRecordState(recordId: number, state: State): Promise<Records> {
        try {
            return await this.recordsRepository.updateState(recordId, state);
        } catch (error) {
            throw new Error(`Record with id: ${recordId} is not found. Rolling back update state action.`)
        }
    }

    public async deleteRecord(recordId: number): Promise<Records> {
        const deletedUser = await this.recordsRepository.delete(recordId);

        if (deletedUser == null) {
            throw new Error(`Record with id: ${recordId} is not found. Rolling back delete action.`)
        }
        return deletedUser;
    }

    public async getRecordsByUser(userId: number, page?: number, pageSize?: number,
                                  title?: string, startDate?: Date, endDate?: Date):Promise<Records[]> {
        return this.recordsRepository.findRecordsByUserId(userId, page, pageSize, {title, startDate, endDate});
    }
}

export default new RecordsService();
