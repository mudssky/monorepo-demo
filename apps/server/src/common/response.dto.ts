import { API_CODE, API_MSG } from '@/common/constant/response'
import { HttpStatus } from '@nestjs/common'
interface OkResponse<T = any> {
  code: API_CODE
  data: T | null
  msg: string
}
interface ErrorResponse extends OkResponse {
  error: {
    statusCode: HttpStatus
    // message: string
  }
}

export class ApiResponse {
  Success<T = any>(data: T, msg = API_MSG[API_CODE.SUCCESS]) {
    return this.Result({
      code: API_CODE.SUCCESS,
      data: data,
      msg,
    })
  }

  Fail(msg: string = API_MSG[API_CODE.Fail], error?: ErrorResponse['error']) {
    return {
      code: API_CODE.Fail,
      data: null,
      msg,
      error,
    } as ErrorResponse
  }
  private Result(res: OkResponse) {
    return res
  }
}

export const GlobalApiResponse = new ApiResponse()
