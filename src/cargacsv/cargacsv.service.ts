import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cargacsv } from './cargacsv.entity';
import { CreateCargacsvDto } from './dto/createCargacsv';

@Injectable()
export class CargacsvService {
  constructor(
    @InjectModel(Cargacsv.name)
    private readonly cargacsvModel: Model<Cargacsv>,
  ) {}

  async create(createCargacsvDto: CreateCargacsvDto): Promise<Cargacsv | null> {
    try {
      const cargacsv = new this.cargacsvModel(createCargacsvDto);
      return await cargacsv.save();
    } catch (err) {
      console.error('Error creating CSV upload:', err);
      return null;
    }
  }

  async findAll(page = 1, limit = 10): Promise<{ data: Cargacsv[]; total: number } | null> {
    try {
      const skip = (page - 1) * limit;
      const [data, total] = await Promise.all([
        this.cargacsvModel
          .find()
          .sort({ uploadedAt: -1 })
          .skip(skip)
          .limit(limit)
          .exec(),
        this.cargacsvModel.countDocuments().exec(),
      ]);
      return { data, total };
    } catch (err) {
      console.error('Error retrieving CSV uploads:', err);
      return null;
    }
  }

  async findOne(id: string): Promise<Cargacsv | null> {
    try {
      return await this.cargacsvModel.findById(id).exec();
    } catch (err) {
      console.error('Error retrieving CSV upload:', err);
      return null;
    }
  }
}