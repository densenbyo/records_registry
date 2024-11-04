export class StringToNumberValidator {
    private static numberRegex: RegExp = /^[1-9]\d*$/;

    public static validate(stringToNumber: string): boolean {
        if (stringToNumber == null || undefined) {
            return true;
        }

        return this.numberRegex.test(stringToNumber);
    }
}
