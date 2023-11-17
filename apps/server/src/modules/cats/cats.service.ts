import { Injectable } from '@nestjs/common'
import { Cat } from './interfaces/cat.interface'

@Injectable()
export class CatsDatabaseService {
  getCats(): Cat[] {
    return [
      {
        name: 'Miauw',
        age: 1,
        breed: 'fasd',
      },
      {
        name: 'dsa',
        age: 2,
        breed: 'ccc',
      },
    ]
  }
}

@Injectable()
export class CatsService {
  constructor(private database: CatsDatabaseService) {}
  private readonly cats: Cat[] = []

  create(cat: Cat) {
    this.cats.push(cat)
  }
  findAll(): Cat[] {
    return this.database.getCats()
  }
  findOne(id: number) {
    console.log({ id })
  }
}
