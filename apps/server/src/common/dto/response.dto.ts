import { API_CODE, API_MSG } from '@/common/constant/response'
import { HttpException, HttpStatus } from '@nestjs/common'
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger'
import { PaginationDto } from './request.dto'
interface APIResponse<T = any> {
  code: API_CODE
  data: T | null
  msg: string | string[]
}
interface ErrorResponse extends APIResponse {
  error: {
    statusCode: HttpStatus
    // message: string
  }
}

export class CustomResponseDto<T> implements APIResponse {
  @ApiProperty() //为了避免循环依赖，不使用API_CODE枚举
  code: number
  @ApiHideProperty() //隐藏data，避免造成循环依赖
  data: T
  @ApiProperty({
    type: 'string', //数组的情况是例外
  })
  msg: string | string[]
}
export class CustomResponse {
  Success<T = any>(data: T, msg = API_MSG[API_CODE.SUCCESS]) {
    return this.Result({
      code: API_CODE.SUCCESS,
      data: data,
      msg,
    })
  }

  Fail(exception: HttpException) {
    return {
      code: API_CODE.Fail,
      data: null,
      msg: exception.message,
      error: exception.getResponse(),
    } as ErrorResponse
  }
  private Result<T = any>(res: APIResponse<T>) {
    return res
  }
}

export const GlobalApiResponse = new CustomResponse()

export class PaginationBaseVo extends PaginationDto {
  @ApiProperty()
  totalCount: number
}
export class PaginationVo<T = any> extends PaginationBaseVo {
  @ApiProperty({ type: 'array' })
  results: T[]
}
