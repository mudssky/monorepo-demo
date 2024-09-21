import { API_CODE, API_MSG } from '@/common/constant/response'
import { PaginationVo } from '@/common/dto'
import { Type, applyDecorators } from '@nestjs/common'
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiResponseOptions,
  getSchemaPath,
} from '@nestjs/swagger'
import {
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface'

type SchemaObjectOrReferenceObject = SchemaObject | ReferenceObject
/**
 * 抽出响应的公共部分
 * @param dataSchemeRef
 * @returns
 */
function createResponseScheme(dataSchemeRef: SchemaObjectOrReferenceObject) {
  return {
    schema: {
      // title: `CustomResponseOf${model.name}`,
      allOf: [
        {
          properties: {
            code: { type: 'number', default: API_CODE.SUCCESS },
            data: dataSchemeRef,
            msg: { type: 'string', default: API_MSG[API_CODE.SUCCESS] },
          },
        },
        // 继承的方法，无法控制属性的排列顺序
        //   { $ref: getSchemaPath(CustomResponseDto<TModel>) },
      ],
    },
  } satisfies ApiResponseOptions
}

/**
 * 自定义swagger响应
 * @param model
 * @returns
 */
export const ApiCustomResponse = <TModel extends Type<any>>(options: {
  description?: string
  type: TModel | TModel[] | (() => TModel) | (() => TModel[])
}) => {
  const { type, description } = options
  // 针对type传入数组的兼容处理
  const isModalArray = Array.isArray(type)
  const modelType = isModalArray ? type?.[0] : type

  function getDataScheme(): SchemaObjectOrReferenceObject {
    if (isModalArray) {
      return {
        type: 'array',
        items: {
          $ref: getSchemaPath(modelType),
        },
        description,
        required: [],
      } satisfies SchemaObject
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
  const dataScheme = getDataScheme()
  const okResponseDec = ApiOkResponse(createResponseScheme(dataScheme))
  return applyDecorators(ApiExtraModels(modelType), okResponseDec)
}

export const ApiPaginatedResponse = <TModel extends Type<any>>(options: {
  type: TModel
}) => {
  const { type } = options
  return applyDecorators(
    ApiExtraModels(PaginationVo, type),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginationVo) },
          {
            properties: {
              results: {
                type: 'array',
                items: { $ref: getSchemaPath(type) },
              },
            },
          },
        ],
      },
    }),
  )
}
