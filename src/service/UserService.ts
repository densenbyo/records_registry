import { UserRepository } from '../repository/UserRepository';
import { Role, User } from '@prisma/client';
import {EmailValidator} from "../util/validators/EmailValidator";
import {UsernameValidator} from "../util/validators/UsernameValidator";

export class UserService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    public async createUser(username: string, email: string, age: number): Promise<User> {
        if (!EmailValidator.validate(email)) {
            throw new Error("Email is not valid.");
        }
        if (!UsernameValidator.validate(username)) {
            throw new Error("Username is not valid");
        }

        return this.userRepository.create(username, email, age);
    }

    public async getUserById(userId: number): Promise<User> {
        const user = await this.userRepository.findUserByIdLazy(userId);

        if (user == null) {
            throw new Error(`User with id: ${userId} is not found.`);
        }
        return user;
    }

    public async updateUser(userId: number, username: string, email: string, age: number): Promise<User> {
        const updateUser = await this.userRepository.update(userId, username, email, age);

        if (updateUser == null) {
            throw new Error(`User with id: ${userId} is not found. Rolling back update action.`)
        }
        return updateUser;
    }

    public async updateUserRole(userId: number, role: Role): Promise<User> {
        const updateUser = await this.userRepository.updateRole(userId, role);

        if (updateUser == null) {
            throw new Error(`User with id: ${userId} is not found. Rolling back update role action.`)
        }
        return updateUser;
    }

    public async deleteUser(userId: number): Promise<User> {
        const deletedUser = await this.userRepository.delete(userId);

        if (deletedUser == null) {
            throw new Error(`User with id: ${userId} is not found. Rolling back delete action.`)
        }
        return deletedUser;
    }
}
