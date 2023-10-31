import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class User {
  @ApiPropertyOptional()
  name?: string
  @ApiProperty()
  email: string
}
