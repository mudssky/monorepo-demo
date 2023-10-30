import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'

export class CreatePigDto {
  @ApiProperty({
    description: '名字',
  })
  name: string
  @ApiProperty()
  age: number
  @ApiProperty()
  breed: string
}

@Controller('pigs')
export class PigsController {
  @Post()
  create(@Body() createPigDto: CreatePigDto) {
    console.log({ createPigDto })

    return 'This action adds a new cat'
  }

  @Get()
  findAll(@Query() query: any) {
    return `This action returns all cats (limit: ${query.limit} items)`
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `This action returns a #${id} cat`
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCatDto: any) {
    console.log({ updateCatDto })

    return `This action updates a #${id} cat`
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `This action removes a #${id} cat`
  }
}
