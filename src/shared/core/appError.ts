import { Error } from "./errors";
import { Result } from "./result";

export class UnexpectedError extends Result<Error> {
  public readonly name = "UnexpectedError";

  /**
   * Constructs an UnexpectedError instance
   * @param err The original error thrown or encountered
   */
  public constructor(err: unknown) {
    super(false, {
      message: `An unexpected error occurred.`,
      error: err instanceof Error ? err : "Error Occured",
    } as Error);

    // Log with stack trace if available
    if (err instanceof Error && err.message) {
      // Replace console.error with a logging mechanism if available
      // For now, comment out to avoid unexpected console statement
      // console.error(`[${this.name}]`, err.stack);
    }
  }

  /**
   * Static factory method to create an UnexpectedError
   * @param err The original error
   * @returns UnexpectedError
   */
  public static create(err: unknown): UnexpectedError {
    return new UnexpectedError(err);
  }
}
