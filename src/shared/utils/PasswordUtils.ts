import bcript from "bcrypt";
export class PasswordUtils {
  private static saltValue: number = 10;

  public static async hashPassword(plainPwd: string): Promise<string> {
    return bcript.hashSync(plainPwd, this.saltValue);
  }

  public static async verifyPassword(plainPwd: string, hashPwd: string): Promise<boolean> {
    return bcript.compareSync(plainPwd, hashPwd);
  }

  public static generatePassword(): string {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const special = "@";

    const allChars = upper + lower + numbers + special;

    // Random password length between 8 and 14
    const length = Math.floor(Math.random() * (14 - 8 + 1)) + 8;

    // Ensure at least one of each required character type
    let password = [
      upper[Math.floor(Math.random() * upper.length)],
      lower[Math.floor(Math.random() * lower.length)],
      numbers[Math.floor(Math.random() * numbers.length)],
      special,
    ];

    // Fill remaining characters randomly
    for (let i = password.length; i < length; i++) {
      password.push(allChars[Math.floor(Math.random() * allChars.length)]);
    }

    // Shuffle to randomize character order
    password = password.sort(() => Math.random() - 0.5);

    return password.join("");
  }
}
