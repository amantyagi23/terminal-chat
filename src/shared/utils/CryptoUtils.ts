import crypto, { randomBytes } from "crypto";

class CryptoUtils {
  private static readonly ALGORITHM = "aes-256-gcm";
  private static readonly KEY = CryptoUtils.deriveKey(
    process.env["ENCRYPTION_PASSWORD"] as string,
    32
  );

  // ⚠️ Fixed IV (dangerous unless you know the trade-off)
  private static generateIV(plainText: string): Buffer {
    // Create a deterministic IV from the plainText
    return crypto.createHash("sha256").update(plainText).digest().subarray(0, 12); // 12 bytes
  }

  public static generateInviteLink() {
    return randomBytes(40).toString("hex"); // 64-char hex
  }

  private static deriveKey(password: string, length: number): Buffer {
    const salt = "your-static-salt"; // You can move to env if needed
    return crypto.pbkdf2Sync(password, salt, 100000, length, "sha512");
  }

  public static encrypt(plainText: string): string {
    const iv = this.generateIV(plainText);
    const cipher = crypto.createCipheriv(this.ALGORITHM, this.KEY, iv);

    const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
    const authTag = cipher.getAuthTag();

    const result = Buffer.concat([authTag, encrypted]);
    return result.toString("base64");
  }

  public static decrypt(encryptedData: string, plainText: string): string {
    const data = Buffer.from(encryptedData, "base64");

    const authTag = data.subarray(0, 16);
    const encrypted = data.subarray(16);
    const iv = this.generateIV(plainText); // deterministically recompute IV from input

    const decipher = crypto.createDecipheriv(this.ALGORITHM, this.KEY, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString("utf8");
  }
}

export default CryptoUtils;
