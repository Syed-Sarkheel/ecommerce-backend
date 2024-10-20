import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RolesGuard } from '../auth/auth.roles.guard';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';
import { IAuthRequest } from 'src/interfaces/IAuthRequest';
import { Roles } from '../auth/auth.roles.decorator';
import { UserRoles } from '../auth/enums/user.roles';
import { ProductService } from '../products/products.service';

@UseGuards(RolesGuard)
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly productService: ProductService) {}

  @Get('myWishlist')
  @UseGuards(JwtAuthGuard)
  async getMyWishlist(@Req() req: IAuthRequest) {
    return this.productService.getUserWishlist(req.user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id')
  @Roles(UserRoles.CUSTOMER)
  async addToWishlist(@Req() req: IAuthRequest, @Param('id') id: string) {
    return this.productService.addToWishlist(req.user._id, id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @Roles(UserRoles.CUSTOMER)
  async removeFromWishlist(@Req() req: IAuthRequest, @Param('id') id: string) {
    return this.productService.removeFromWishlist(req.user._id, id);
  }
}
