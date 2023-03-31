import { ApiProperty } from "@nestjs/swagger";

export class PaginatorDto {
    @ApiProperty({required: false, default: '1'})
    readonly pageNumber: string;
    @ApiProperty({required: false, default: '10'})
    readonly pageSize: string;
}