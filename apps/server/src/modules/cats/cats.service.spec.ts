import { TestBed } from '@automock/jest'
import { CatsDatabaseService, CatsService } from './cats.service'

describe('CatsService', () => {
  let service: CatsService
  let database: jest.Mocked<CatsDatabaseService>
  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(CatsService).compile()
    service = unit
    database = unitRef.get(CatsDatabaseService)
  })

  it('should be defined', () => {
    service.findAll()
    expect(database.getCats).toHaveBeenCalled()
    expect(service).toBeDefined()
  })
})
