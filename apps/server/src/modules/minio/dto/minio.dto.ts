import { ApiHideProperty, ApiProperty } from '@nestjs/swagger'
import { DAY } from '@/common/constant'

export class PresignedUrlParamDto {
  //   @ApiProperty({ description: '存储桶名称' })
  @ApiHideProperty()
  bucketName?: string
  @ApiProperty({ description: '对象名称，就是url路径' })
  objectName: string
  @ApiProperty({ description: '过期时间，单位秒,默认7天' })
  expires?: number = 7 * DAY
  @ApiProperty({ description: '其他请求参数' })
  reqParams?: any
  @ApiProperty({ description: '请求日期,Date对象' })
  requestDate?: Date
}
