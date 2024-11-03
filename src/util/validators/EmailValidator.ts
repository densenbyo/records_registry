export class EmailValidator {
    private static emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    public static validate(email: string): boolean {
        return this.emailRegex.test(email) && email.length <= 50;
    }
}