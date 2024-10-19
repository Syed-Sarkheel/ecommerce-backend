import { Module } from '@nestjs/common';
import { WishlistController } from './wishlist.controller';
import { AuthModule } from '../auth/auth.module';
import { ProductModule } from '../products/products.module';

@Module({
  imports: [AuthModule, ProductModule],
  controllers: [WishlistController],
})
export class WishlistModule {}
