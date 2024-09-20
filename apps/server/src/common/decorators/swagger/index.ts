import { API_CODE, API_MSG } from '@/common/constant/response'
import { Type, applyDecorators } from '@nestjs/common'
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger'

/**
 * 自定义swagger响应
 * @param model
 * @returns
 */
export const ApiCustomResponse = <TModel extends Type<any>>(options: {
  description?: string
  type: TModel | TModel[]
}) => {
  const { type, description } = options
  // 针对type传入数组的兼容处理
  const isModalArray = Array.isArray(type)
  const modelType = isModalArray ? type?.[0] : type

  function getDataScheme() {
    if (isModalArray) {
      return {
        type: 'array',
        items: {
          $ref: getSchemaPath(modelType),
        },
        description,
        required: [],
      }
    }
    // 处理 Boolean 类型
    if ((modelType as any) === Boolean) {
      return {
        type: 'boolean',
        description,
        required: [],
      }
    }
    // Dto的情况
    return {
      $ref: getSchemaPath(modelType),
      description,
      required: [],
    }
  }

  const okResponseDec = ApiOkResponse({
    schema: {
      // title: `CustomResponseOf${model.name}`,
      allOf: [
        {
          properties: {
            code: { type: 'number', default: API_CODE.SUCCESS },
            data: getDataScheme(),
            msg: { type: 'string', default: API_MSG[API_CODE.SUCCESS] },
          },
        },
        // 继承的方法，无法控制属性的排列顺序
        //   { $ref: getSchemaPath(CustomResponseDto<TModel>) },
      ],
    },
  })
  return applyDecorators(ApiExtraModels(modelType), okResponseDec)
}
