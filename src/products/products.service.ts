import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from './schema/product.schema';
import { Review } from './schema/review.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) public productModel: Model<ProductDocument>,
  ) {}

  async create(
    createdBy: any,
    createProductDto: CreateProductDto,
  ): Promise<Product> {
    const { name } = createProductDto;

    const existingProduct = await this.productModel.findOne({ name }).exec();
    if (existingProduct) {
      throw new ConflictException('Product with this name already exists.');
    }

    const newProduct = new this.productModel({
      ...createProductDto,
      createdBy: createdBy,
    });
    return await newProduct.save();
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .exec();
    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return updatedProduct;
  }

  async delete(id: string): Promise<void> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }
}
