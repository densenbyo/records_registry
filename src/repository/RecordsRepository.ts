import { PrismaClient, State, Records } from "@prisma/client";

const prisma = new PrismaClient();

export class RecordsRepository {
    // Create a new record
    public async create(title: string, content: string, userId: number): Promise<Records> {
        return prisma.records.create({
            data: {
                title,
                content,
                userId,
            },
        });
    }

    public async findRecordById(recordId: number): Promise<Records | null> {
        return prisma.records.findUnique({
            where: { id: recordId },
        });
    }

    public async update(recordId: number, title: string, content: string, state: State): Promise<Records | null> {
        return prisma.records.update({
            where: { id: recordId },
            data: {
                title,
                content,
                state,
            },
        });
    }

    public async delete(recordId: number): Promise<Records | null> {
        return prisma.records.delete({
            where: { id: recordId },
        });
    }

    public async findRecordsByUserId(userId: number): Promise<Records[]> {
        return prisma.records.findMany({
            where: { userId },
        });
    }
}
