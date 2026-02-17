import { v4 as uuid } from "uuid";
import { Identifier } from "./identifier";
import { Result } from "./result";

export class UniqueID extends Identifier<string | number> {
  constructor(id?: string | number) {
    super(id ? id : uuid());
  }

  public static create(id?: UniqueID): Result<UniqueID> {
    return Result.ok<UniqueID>(new UniqueID(id?.toString()));
  }
}
