import { RecordsRepository } from "../repository/RecordsRepository";
import { Records, State, User } from '@prisma/client';
import { UserService } from "./UserService";
import { FileService } from "./FileService";
import {StringToNumberValidator} from "../util/validators/StringToNumberValidator";

export class RecordsService {
    private recordsRepository: RecordsRepository;
    private userService: UserService;
    private fileService: FileService;

    constructor() {
        this.recordsRepository = new RecordsRepository();
        this.userService = new UserService();
        this.fileService = new FileService();
    }

    public async createRecord(title: string, content: string, userId: string, file: Express.Multer.File | undefined): Promise<Records> {
        const parsedUserId = StringToNumberValidator.parseInteger(userId, 'userId');
        const user:User = await this.userService.getUserById(parsedUserId);
        const record: Records = await this.recordsRepository.create(title, content, parsedUserId, user.username);

        if (file) {
            await this.fileService.createFile({
                fileUrl: file.path,
                userId: parsedUserId,
                recordId: record.id,
            });
        }

        return record;
    }

    public async getRecordsById(recordId: string): Promise<Records> {
        const parsedRecordId = StringToNumberValidator.parseInteger(recordId, 'recordId');
        const record = await this.recordsRepository.findRecordById(parsedRecordId);

        if (record == null) {
            throw new Error(`Record with id: ${parsedRecordId} is not found.`);
        }
        return record;
    }

    public async updateRecord(recordId: string, title: string, content: string): Promise<Records> {
        const parsedRecordId = StringToNumberValidator.parseInteger(recordId, 'recordId');
        const updateRecord = await this.recordsRepository.update(parsedRecordId, title, content);

        if (updateRecord == null) {
            throw new Error(`Record with id: ${parsedRecordId} is not found. Rolling back update action.`)
        }
        return updateRecord;
    }

    public async updateRecordState(recordId: string, state: State): Promise<Records> {
        const parsedRecordId = StringToNumberValidator.parseInteger(recordId, 'recordId');
        try {
            return await this.recordsRepository.updateState(parsedRecordId, state);
        } catch (error) {
            throw new Error(`Record with id: ${parsedRecordId} is not found. Rolling back update state action.`)
        }
    }

    public async deleteRecord(recordId: string): Promise<Records> {
        const parsedRecordId = StringToNumberValidator.parseInteger(recordId, 'recordId');
        const deletedUser = await this.recordsRepository.delete(parsedRecordId);

        if (deletedUser == null) {
            throw new Error(`Record with id: ${parsedRecordId} is not found. Rolling back delete action.`)
        }
        return deletedUser;
    }

    public async getRecordsByUser(userId: string, page?: string, pageSize?: string,
                                  title?: string, startDate?: Date, endDate?: Date):Promise<Records[]> {
        const parsedUserId = StringToNumberValidator.parseInteger(userId, 'userId');
        const parsedPage = page != null ? StringToNumberValidator.parseInteger(page, 'page') : undefined;
        const parsedPageSize = pageSize != null ? StringToNumberValidator.parseInteger(pageSize, 'pageSize') : undefined;

        return this.recordsRepository.findRecordsByUserId(parsedUserId, parsedPage, parsedPageSize, {title, startDate, endDate});
    }
}

export default new RecordsService();
