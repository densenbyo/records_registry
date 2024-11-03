export class UsernameValidator {
    private static usernameRegex: RegExp = /^(?!_)(?!.*__)[a-zA-Z0-9_]{3,25}(?<!_)$/;

    public static validate(username: string): boolean {
        return this.usernameRegex.test(username) && username.length <= 25;
    }
}