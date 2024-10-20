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
import { Category } from './enums/category.enums';
import { getEnumValues } from '../utils/enums.utils';
import { Wishlist, WishlistDocument } from '../wishlist/schema/wishlist.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) public productModel: Model<ProductDocument>,
    @InjectModel(User.name) public userModel: Model<UserDocument>,
    @InjectModel(Wishlist.name) public wishListModel: Model<WishlistDocument>,
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

  // async findByName(name: string): Promise<any> {
  //   const product = await this.productModel
  //     .find({ name: { $regex: name, $options: 'i' } })
  //     .exec();
  //   console.log(product);
  //   if (!product) {
  //     throw new NotFoundException(`Product with name ${name} not found`);
  //   }
  //   return createApiResponse(
  //     'Product retrieved successfully',
  //     product,
  //     '200',
  //     null,
  //   );
  // }

  async getCategories(): Promise<object> {
    const categories = getEnumValues(Category);
    return createApiResponse('Categories Fetched sucessfully', categories);
  }

  async filterByCategory(category: Category): Promise<object> {
    const products = await this.productModel
      .find({ category: category })
      .exec();
    if (!products || products.length === 0) {
      throw new NotFoundException(`No products found in category ${category}`);
    }
    return createApiResponse(
      `Products with the category ${category} fetched sucessfully`,
      products,
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
  async addToWishlist(userId: string, productId: string): Promise<any> {
    console.log(userId, productId);

    try {
      // Check if the product exists
      const product = await this.productModel.findById(productId);
      if (!product) {
        throw new NotFoundException('Product not found');
      }

      // Check if the product is already in the user's wishlist
      const existingWishlist = await this.wishListModel.findOne({
        user: userId,
        product: productId,
      });

      if (existingWishlist) {
        throw new ConflictException('Product already in wishlist');
      }

      // Add the product to the wishlist
      const wishlist = new this.wishListModel({
        user: userId,
        product: productId,
      });

      // Increment the wishlist count for the product
      product.wishlistCount = (product.wishlistCount || 0) + 1;
      await product.save();

      return { message: 'Product added to wishlist', product };
    } catch (error) {
      throw error;
    }
  }

  async removeFromWishlist(userId: string, productId: string): Promise<any> {
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const wishlist = await this.wishListModel.findOneAndDelete({
      user: userId,
      product: productId,
    });
    if (!wishlist) {
      throw new NotFoundException('Product not in wishlist');
    }

    product.wishlistCount -= 1;
    await product.save();

    return { message: 'Product removed from wishlist', product };
  }

  // async getUserWishlist(userId: string): Promise<Product[]> {
  //   const wishlists = await this.wishListModel.find({ user: userId }).populate('product').exec();
  //   return wishlists.map(wishlist => wishlist.product);
  // }
}
