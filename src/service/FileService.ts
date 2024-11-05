import { FileRepository } from "../repository/FileRepository";
import { File } from '@prisma/client';
import path from "path";
import * as fs from "fs";

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

    public async deleteFileFromLocal(fileUrl: string): Promise<void> {
        try {
            const fileBase: string = path.basename(fileUrl);
            const filePath: string = path.join(__dirname, '../../uploads', fileBase);

            await fs.promises.unlink(filePath);
            console.log(`File with name: ${fileBase} has been deleted.`);
        } catch (error) {
            console.error(`Failed to delete file: ${fileUrl}`, error);
        }
    }

    public async deleteFileFromDb(fileId: number): Promise<void> {
        await this.fileRepository.deleteFileMetadata(fileId);
    }

    public async findFileByUserId(userId: number): Promise<File[]> {
        return await this.fileRepository.getFilesByUserId(userId);
    }

    public async findFilesByRecordId(recordId: number): Promise<File[]> {
        return await this.fileRepository.getFilesByRecordId(recordId);
    }
}