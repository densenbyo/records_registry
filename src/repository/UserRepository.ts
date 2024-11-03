import {PrismaClient, Role, User} from "@prisma/client";

const prisma = new PrismaClient();

export class UserRepository {
    public async create(username:string, email:string, age:number):Promise<User>   {
        return prisma.user.create({
            data: {
                username,
                email,
                age,
            },
        });
    }

    public async findUserByIdLazy(userId:number):Promise<User|null> {
        return prisma.user.findUnique({
            where: {id: userId},
        });
    }

    public async update(userId:number, username:string, email:string, age:number):Promise<User|null> {
        return prisma.user.update({
            where: {id: userId},
            data: {
                username,
                email,
                age,
            },
        });
    }

    public async updateRole(userId:number, role:Role):Promise<User|null> {
        return prisma.user.update({
            where: {id: userId},
            data: {
                role
            },
        });
    }

    public async delete(userId:number):Promise<User|null> {
        return prisma.user.delete({
            where: {id: userId},
        });
    }
}
