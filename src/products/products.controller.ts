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
import { RolesGuard } from 'src/auth/auth.roles.guard';
import { ProductService } from './products.service';
import { Roles } from 'src/auth/auth.roles.decorator';
import { UserRoles } from 'src/auth/enums/user.roles';
import { IAuthRequest } from 'src/interfaces/IAuthRequest';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';

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

  @Get()
  async findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRoles.ADMIN) // Only admins can update products
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @Roles(UserRoles.ADMIN) // Only admins can delete products
  async delete(@Param('id') id: string) {
    return this.productService.delete(id);
  }
}
