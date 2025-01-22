// import { ApiProperty } from '@nestjs/swagger';
// import { Prisma } from '@prisma/client';
// import { Decimal } from '@prisma/client/runtime/library';
// import { Expose } from 'class-transformer';
// import {
//   ArrayMaxSize,
//   ArrayMinSize,
//   IsArray,
//   IsDecimal,
//   IsOptional,
//   Max,
//   Min,
// } from 'class-validator';

// export class DecimalFilterRequest implements Prisma.DecimalFilter {
//   @ApiProperty({ type: Decimal, required: false })
//   @Max(Number.MAX_SAFE_INTEGER)
//   @Min(Number.MIN_SAFE_INTEGER)
//   @IsDecimal()
//   @IsOptional()
//   @Expose()
//   equals?: Decimal;

//   @ApiProperty({ type: [Decimal], required: false })
//   @Max(Number.MAX_SAFE_INTEGER, { each: true })
//   @Min(Number.MIN_SAFE_INTEGER, { each: true })
//   @IsDecimal(null, { each: true })
//   @ArrayMaxSize(16)
//   @ArrayMinSize(1)
//   @IsArray()
//   @IsOptional()
//   @Expose()
//   in?: Decimal[];

//   @ApiProperty({ type: [Decimal], required: false })
//   @Max(Number.MAX_SAFE_INTEGER, { each: true })
//   @Min(Number.MIN_SAFE_INTEGER, { each: true })
//   @IsDecimal(null, { each: true })
//   @ArrayMaxSize(16)
//   @ArrayMinSize(1)
//   @IsArray()
//   @IsOptional()
//   @Expose()
//   notIn?: Decimal[];

//   @ApiProperty({ type: Decimal, required: false })
//   @Max(Number.MAX_SAFE_INTEGER)
//   @Min(Number.MIN_SAFE_INTEGER)
//   @IsDecimal()
//   @IsOptional()
//   @Expose()
//   lt?: Decimal;

//   @ApiProperty({ type: Decimal, required: false })
//   @Max(Number.MAX_SAFE_INTEGER)
//   @Min(Number.MIN_SAFE_INTEGER)
//   @IsDecimal()
//   @IsOptional()
//   @Expose()
//   lte?: Decimal;

//   @ApiProperty({ type: Decimal, required: false })
//   @Max(Number.MAX_SAFE_INTEGER)
//   @Min(Number.MIN_SAFE_INTEGER)
//   @IsDecimal()
//   @IsOptional()
//   @Expose()
//   gt?: Decimal;

//   @ApiProperty({ type: Decimal, required: false })
//   @Max(Number.MAX_SAFE_INTEGER)
//   @Min(Number.MIN_SAFE_INTEGER)
//   @IsDecimal()
//   @IsOptional()
//   @Expose()
//   gte?: Decimal;
// }
