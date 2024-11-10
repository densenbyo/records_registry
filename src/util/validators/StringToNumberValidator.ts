export class StringToNumberValidator {
    private static numberRegex: RegExp = /^[1-9]\d*$/;

    public static validate(stringToNumber: string): boolean {
        if (stringToNumber == null || undefined) {
            return true;
        }

        return this.numberRegex.test(stringToNumber);
    }

    public static parseInteger(stringToNumber: string, message: string): number {
        if (this.validate(stringToNumber) && stringToNumber != null) {
            return parseInt(stringToNumber);
        } else {
            console.error(`${message} is not valid. It looks like 'abc', but should look like '123'.`);
            throw new Error(`${message} is not valid. It looks like 'abc', but should look like '123'.`);
        }
    }
}
