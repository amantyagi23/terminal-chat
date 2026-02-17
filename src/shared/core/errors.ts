interface IError {
  message: string;
}

export abstract class Error implements IError {
  public readonly message: string;

  constructor(message: string) {
    this.message = message;
  }
}
