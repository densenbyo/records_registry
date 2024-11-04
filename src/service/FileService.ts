import { FileRepository } from "../repository/FileRepository";
import { File } from '@prisma/client';

export class FileService {
    private fileRepository: FileRepository;

    constructor() {
        this.fileRepository = new FileRepository();
    }

    public async createFile(fileData: { fileUrl: string; userId: number; recordId: number }): Promise<void> {
        try {
            await this.fileRepository.createFileMetadata(fileData);
        } catch (error) {
            console.error('Error saving file metadata:', error);
            throw new Error('Could not save file metadata');
        }
    }

    public async deleteFile(fileId: number): Promise<void> {
        await this.fileRepository.deleteFileMetadata(fileId);
    }

    public async findFileByUserId(userId: number): Promise<File[]> {
        return await this.fileRepository.getFilesByUserId(userId);
    }

    public async findFilesByRecordId(recordId: number): Promise<File[]> {
        return await this.fileRepository.getFilesByRecordId(recordId);
    }
}