import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RolesGuard } from 'src/modules/auth/auth.roles.guard';
import { ProductService } from './products.service';
import { Roles } from 'src/modules/auth/auth.roles.decorator';
import { UserRoles } from 'src/modules/auth/enums/user.roles';
import { IAuthRequest } from 'src/interfaces/IAuthRequest';
import { JwtAuthGuard } from 'src/modules/auth/jwt.auth.guard';
import { ReviewProductDto } from './dto/review-product.dto';

@UseGuards(RolesGuard)
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(UserRoles.ADMIN)
  @Post()
  async create(
    @Req() req: IAuthRequest,
    @Body() createProductDto: CreateProductDto,
  ) {
    console.log(req.user);

    const newProduct = await this.productService.create(
      req.user._id,
      createProductDto,
    );
    return newProduct;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.productService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @Roles(UserRoles.ADMIN) // Only admins can update products
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @Roles(UserRoles.ADMIN) // Only admins can delete products
  async delete(@Param('id') id: string) {
    return this.productService.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/review')
  @Roles(UserRoles.CUSTOMER)
  async createReview(
    @Req() req: IAuthRequest,
    @Param('id') id: string,
    @Body() reviewProductDto: ReviewProductDto,
  ) {
    return this.productService.addReview(req.user._id, id, reviewProductDto);
  }
}
