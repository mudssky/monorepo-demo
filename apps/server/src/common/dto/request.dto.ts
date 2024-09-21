import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsInt, IsOptional, Max, Min } from 'class-validator'

export class PaginationDto {
  @ApiProperty()
  @IsOptional()
  @Transform(({ value }) => +value)
  @IsInt()
  @Min(1)
  pageNo?: number = 1 // 默认页码为 1

  @ApiProperty()
  @IsOptional()
  @Transform(({ value }) => +value)
  @IsInt()
  @Min(1)
  @Max(2000)
  pageSize?: number = 10 // 默认每页记录为 10
}

/**
 * 解析分页参数，生成prisma需要的参数
 * @param paginationDto
 * @returns
 */
export function parsePaginationDto(paginationDto: PaginationDto) {
  const { pageNo = 1, pageSize = 10 } = paginationDto
  const skip = (pageNo - 1) * pageSize
  const take = pageSize
  return { skip, take }
}
