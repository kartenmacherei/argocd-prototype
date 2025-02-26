export class StackConfiguration {

    public static getName(): string {
      return this.getFromEnvironment('NAME');
    }

    private static getFromEnvironment(name: string): string {
        const value = process.env[name];
        if (process.env['ENVIRONMENT'] && process.env['ENVIRONMENT'] === 'test') {
            return value ? value : '';
        }
        if (value === undefined) {
            throw Error(`Environment variable ${name} is not set.`);
        }

        return value;
    }
}