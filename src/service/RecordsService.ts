import { RecordsRepository } from "../repository/RecordsRepository";
import { Records, State } from '@prisma/client';

export class RecordsService {
    private recordsRepository: RecordsRepository;

    constructor() {
        this.recordsRepository = new RecordsRepository();
    }

    public async createRecord(title: String, content: String, userId: number): Promise<Records> {
        return this.recordsRepository.create(title, content, userId);
    }

    public async getRecordsById(recordId: number): Promise<Records> {
        const record = this.recordsRepository.findRecordById(recordId);

        if (record == null) {
            throw new Error(`Record with id: ${recordId} is not found.`);
        }
        return record;
    }

    public async updateRecord(recordId: number, title: string, content: string): Promise<Records> {
        const updateRecord = this.recordsRepository.update(recordId, title, content);

        if (updateRecord == null) {
            throw new Error(`Record with id: ${recordId} is not found. Rolling back update action.`)
        }
        return updateRecord;
    }

    public async updateRecordState(recordId: number, state: State): Promise<Records> {
        const updateRecord = this.recordsRepository.updateState(recordId, state);

        if (updateRecord == null) {
            throw new Error(`Record with id: ${recordId} is not found. Rolling back update role action.`)
        }
        return updateRecord;
    }

    public async deleteRecord(recordId: number): Promise<Records> {
        const deletedUser = this.recordsRepository.delete(recordId);

        if (deletedUser == null) {
            throw new Error(`Record with id: ${recordId} is not found. Rolling back delete action.`)
        }
        return deletedUser;
    }

    public async getRecordsByUser(userId: number):Promise<Records> {
        return this.recordsRepository.findRecordsByUserId(userId);
    }
}

export default new RecordsService();
