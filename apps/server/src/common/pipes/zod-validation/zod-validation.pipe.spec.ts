import { z } from 'zod'
import { ZodValidationPipe } from './zod-validation.pipe'

export const createCatSchema = z
  .object({
    name: z.string(),
    age: z.number(),
    breed: z.string(),
  })
  .required()

describe('ZodValidationPipe', () => {
  it('should be defined', () => {
    expect(new ZodValidationPipe(createCatSchema)).toBeDefined()
  })
})
