import {
  Controller,
  Post as HttpPost,
  Get,
  Param,
  Body,
  Query,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CargacsvService } from './cargacsv.service';
import { CreateCargacsvDto } from './dto/createCargacsv';
import { Cargacsv } from './cargacsv.entity';
import { SuccessResponseDto } from 'src/common/dto/response.dto';

@Controller('csv-uploads')
export class CargacsvController {
  constructor(private readonly cargacsvService: CargacsvService) {}

  @HttpPost()
  async create(
    @Body() createCargacsvDto: CreateCargacsvDto,
  ): Promise<SuccessResponseDto<Cargacsv>> {
    const csv = await this.cargacsvService.create(createCargacsvDto);
    if (!csv)
      throw new NotFoundException('Error creating CSV upload');
    return new SuccessResponseDto(
      'CSV upload created successfully',
      csv,
    );
  }

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<SuccessResponseDto<{ data: Cargacsv[]; total: number }>> {
    const csvs = await this.cargacsvService.findAll(Number(page), Number(limit));

    if (!csvs) {
      throw new InternalServerErrorException('Error retrieving CSV uploads');
    }

    return new SuccessResponseDto(
      'CSV uploads retrieved successfully',
      csvs,
    );
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<SuccessResponseDto<Cargacsv>> {
    const csv = await this.cargacsvService.findOne(id);

    if (!csv) {
      throw new NotFoundException('CSV upload not found');
    }

    return new SuccessResponseDto(
      'CSV upload retrieved successfully',
      csv,
    );
  }
}