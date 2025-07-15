import {
  Controller,
  Post as HttpPost,
  Get,
  Delete,
  Param,
  Body,
  Query,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { CargacsvService } from './cargacsv.service';
import { CreateCargacsvDto } from './dto/createCargacsv';
import { DeleteMultipleDto } from './dto/deleteCargacsv';
import { Cargacsv } from './cargacsv.entity';
import { SuccessResponseDto } from 'src/common/dto/response.dto';
import { Types } from 'mongoose';

@Controller('csv-uploads')
export class CargacsvController {
  constructor(private readonly cargacsvService: CargacsvService) {}

  @HttpPost()
  @UseInterceptors(FileInterceptor('file', { dest: './uploads' }))
  async uploadCsv(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any
  ): Promise<SuccessResponseDto<Cargacsv>> {
    if (!file) {
      console.error('[CSV] No se recibió ningún archivo CSV');
      throw new BadRequestException('No se recibió ningún archivo CSV');
    }
    console.log('[CSV] Archivo recibido:', {
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    });
    console.log('[CSV] Body recibido:', body);

    // Guardar los metadatos y el nombre del archivo
    const csvInfo = {
      filename: file.filename,
      originalname: file.originalname,
      uploadedBy: body.uploadedBy,
      status: body.status || 'pending',
      errorMessage: body.errorMessage || undefined
    };
    const csv = await this.cargacsvService.create(csvInfo);
    if (!csv) {
      console.error('[CSV] Error creando metadatos en la base de datos');
      throw new NotFoundException('Error creating CSV upload');
    }

    // Leer y guardar el contenido del CSV en la base de datos
    const filePath = path.join(process.cwd(), 'uploads', file.filename);
    console.log('[CSV] Ruta del archivo:', filePath);
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      console.log('[CSV] Primeros 200 caracteres del archivo:', fileContent.slice(0, 200));
      await this.cargacsvService.saveCsvRowsInDocument(fileContent, new Types.ObjectId(String(csv._id)));
    } catch (err) {
      console.error('[CSV] Error leyendo o guardando el archivo:', err);
    }
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

  @Delete(':id')
  async deleteOne(
    @Param('id') id: string,
  ): Promise<SuccessResponseDto<{ message: string }>> {
    if (!id) {
      throw new BadRequestException('ID del archivo CSV es requerido');
    }

    const result = await this.cargacsvService.delete(id);

    if (!result.success) {
      throw new NotFoundException(result.message);
    }

    return new SuccessResponseDto(
      'Archivo CSV eliminado exitosamente',
      { message: result.message },
    );
  }

  @Delete()
  async deleteMultiple(
    @Body() deleteMultipleDto: DeleteMultipleDto,
  ): Promise<SuccessResponseDto<{ 
    message: string; 
    results: { id: string; success: boolean; message: string }[] 
  }>> {
    const result = await this.cargacsvService.deleteMultiple(deleteMultipleDto.ids);

    return new SuccessResponseDto(
      result.message,
      {
        message: result.message,
        results: result.results
      },
    );
  }
}