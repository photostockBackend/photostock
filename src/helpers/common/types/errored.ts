import { ApiProperty } from "@nestjs/swagger";

export abstract class Errored<T> {
  abstract errorMessages: T;
}

export class ErrorSwagger {
    @ApiProperty()
    field: string
    @ApiProperty()
    message: string
}