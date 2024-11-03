import { RecordsRepository } from "../repository/RecordsRepository";
import { Records, State, User } from '@prisma/client';
import { UserService } from "./UserService";

export class RecordsService {
    private recordsRepository: RecordsRepository;
    private userService: UserService;

    constructor() {
        this.recordsRepository = new RecordsRepository();
        this.userService = new UserService();
    }

    public async createRecord(title: string, content: string, userId: number, fileUrl: string): Promise<Records> {
        const user:User = await this.userService.getUserById(userId);
        return await this.recordsRepository.create(title, content, userId, user.username, fileUrl);
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
        const updateRecord = await this.recordsRepository.updateState(recordId, state);

        if (updateRecord == null) {
            throw new Error(`Record with id: ${recordId} is not found. Rolling back update role action.`)
        }
        return updateRecord;
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
