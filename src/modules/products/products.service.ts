import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from './schema/product.schema';
import { ReviewProductDto } from './dto/review-product.dto';
import { User, UserDocument } from '../auth/schema/auth.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) public productModel: Model<ProductDocument>,
    @InjectModel(User.name) public userModel: Model<UserDocument>,
  ) {}

  //adding a product
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

  //find by prod id
  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  //update prod
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

  //delete a prod
  async delete(id: string): Promise<void> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }

  //adding a review (customers only)
  async addReview(
    userId: any,
    productId: string,
    reviewProductDto: ReviewProductDto,
  ) {
    const product = await this.productModel.findById(productId).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const newReview = {
      userId,
      userName: user.name,
      reviewText: reviewProductDto.reviewText,
      rating: reviewProductDto.rating,
    };

    console.log(newReview);
    product.review.push(newReview);
    const addedReview = await product.save();
    return addedReview;
  }
}
