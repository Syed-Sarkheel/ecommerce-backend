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
import { createApiResponse } from '../utils/response.interface';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) public productModel: Model<ProductDocument>,
    @InjectModel(User.name) public userModel: Model<UserDocument>,
  ) {}

  // Adding a product
  async create(
    createdBy: any,
    createProductDto: CreateProductDto,
  ): Promise<object> {
    const { name } = createProductDto;

    const existingProduct = await this.productModel.findOne({ name }).exec();
    if (existingProduct) {
      throw new ConflictException('Product with this name already exists.');
    }

    const newProduct = new this.productModel({
      ...createProductDto,
      createdBy,
    });
    const result = await newProduct.save();
    return createApiResponse(
      'Product created successfully',
      result,
      '201',
      null,
    );
  }

  // Fetch all products
  async findAll(): Promise<object> {
    const products = await this.productModel.find().exec();
    return createApiResponse(
      'Products retrieved successfully',
      products,
      '200',
      null,
    );
  }

  // Find product by ID
  async findOne(id: string): Promise<object> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return createApiResponse(
      'Product retrieved successfully',
      product,
      '200',
      null,
    );
  }

  // Update a product
  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<object> {
    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .exec();
    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return createApiResponse(
      'Product updated successfully',
      updatedProduct,
      '200',
      null,
    );
  }

  // Delete a product
  async delete(id: string): Promise<object> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return createApiResponse('Product deleted successfully', {}, '204', null);
  }

  // Adding a review (customers only)
  async addReview(
    userId: any,
    productId: string,
    reviewProductDto: ReviewProductDto,
  ): Promise<object> {
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

    product.review.push(newReview);
    const addedReview = await product.save();
    return createApiResponse(
      'Review added successfully',
      addedReview,
      '200',
      null,
    );
  }
}
