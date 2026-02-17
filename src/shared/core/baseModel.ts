import { Result } from "./result";
import { pick } from "lodash";

/**
 * Base class for all domain models.
 * Provides a factory method to safely wrap data in a Result<T>.
 */
export class BaseModel {
  /**
   * Create a new domain model instance wrapped in Result<T>.
   *
   * Optionally restricts the keys in `value` using `allowedKeys`.
   *
   * @param value The raw input object
   * @param allowedKeys Optional list of allowed keys to include
   * @returns Result<T> wrapping the model instance
   */
  public static create<T extends BaseModel>(
    value: Partial<T>,
    allowedKeys?: (keyof T)[],
  ): Result<T> {
    try {
      const sanitized = allowedKeys ? (pick(value, allowedKeys) as T) : (value as T);
      // Add validation logic here
      return Result.ok<T>(sanitized);
    } catch (error) {
      return Result.fail(error.message);
    }
  }
}
