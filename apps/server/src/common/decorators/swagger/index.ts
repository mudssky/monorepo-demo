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
  model: TModel
}) => {
  const { model, description } = options
  return applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      schema: {
        // title: `CustomResponseOf${model.name}`,
        allOf: [
          {
            properties: {
              code: {
                type: 'number',
                default: API_CODE.SUCCESS,
              },
              data: {
                $ref: getSchemaPath(model),
                description: description,
              },
              msg: {
                type: 'string',
                default: API_MSG[API_CODE.SUCCESS],
              },
            },
          },
          // 继承的方法，无法控制属性的排列顺序
          //   { $ref: getSchemaPath(CustomResponseDto<TModel>) },
        ],
      },
    }),
  )
}
