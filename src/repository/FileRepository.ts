import { PrismaClient, File } from '@prisma/client';

const prisma = new PrismaClient();

export class FileRepository {
    public async createFileMetadata(fileData: { fileUrl: string; userId: number; recordId: number }): Promise<void> {
        await prisma.file.create({
            data: {
                fileUrl: fileData.fileUrl,
                userId: fileData.userId,
                recordId: fileData.recordId,
            },
        });
    }

    public async getFilesByUserId(userId: number): Promise<File[]> {
        return prisma.file.findMany({
            where: {userId},
        });
    }

    public async getFilesByRecordId(recordId: number): Promise<File[]> {
        return prisma.file.findMany({
            where: {recordId},
        });
    }

    public async deleteFileMetadata(fileId: number): Promise<void> {
        await prisma.file.delete({
            where: {id: fileId},
        });
    }
}
