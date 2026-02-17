import randomString from "randomstring";

export class OTPUtils {
  private static readonly digits: number = 4;

  public static generateOTP(): string {
    return randomString.generate({ length: this.digits, charset: "numeric" });
  }
}
