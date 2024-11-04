import { PrismaClient, State, Records, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class RecordsRepository {
    // Create a new record in new transaction content
    public async create(title: string, content: string, userId: number, senderName: string): Promise<Records> {
        return prisma.$transaction(async (tx) => {
            return tx.records.create({
                data: {
                    title,
                    content,
                    senderName,
                    userId: userId,
                },
            })
        });
    }

    public async findRecordById(recordId: number): Promise<Records | null> {
        return prisma.records.findUnique({
            where: { id: recordId },
        });
    }

    public async update(recordId: number, title: string, content: string): Promise<Records | null> {
        const record = await prisma.records.findUnique({
            where: { id: recordId },
        });
        if (!record) {
            throw new Error(`Record with ID ${recordId} not found. Rolling back update.`);
        }

        return prisma.records.update({
            where: { id: recordId },
            data: {
                title,
                content,
            },
        });
    }

    public async updateState(recordId: number, state: State): Promise<Records> {
        return prisma.$transaction(async (prisma) => {
            const record = await prisma.records.findUnique({
                where: { id: recordId },
            });

            if (!record) {
                throw new Error(`Record with ID ${recordId} not found. Rolling back update state.`);
            }
            return prisma.records.update({
                where: { id: recordId },
                data: { state },
            });
        });
    }

    public async delete(recordId: number): Promise<Records | null> {
        return prisma.records.delete({
            where: { id: recordId },
        });
    }

    public async findRecordsByUserId(userId: number, page?: number, pageSize?: number,
                                     filterOptions?: { title?: string; startDate?: Date; endDate?: Date; state?: State}): Promise<Records[]> {
        const { title, startDate, endDate, state } = filterOptions || {};

        // default values for page or pageSize if they undefined
        const currentPage = page ?? 1;
        const currentPageSize = pageSize ?? 10;

        return prisma.records.findMany({
            where: {
                userId,
                ...(title && { title: {contains: title, mode: 'insensitive'}}),
                ...(startDate && endDate && {
                    createdAt: {
                        gte: startDate,
                        lte: endDate,
                    },
                }),
                ...(state ? {state} : {}),
            },
            skip: (currentPage - 1) * currentPageSize,
            take: currentPageSize,
            orderBy: {
                createdAt: 'desc'
            }
        } as Prisma.RecordsFindManyArgs);
    }
}
