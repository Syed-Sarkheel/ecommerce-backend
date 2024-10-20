import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from './modules/products/products.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './modules/auth/auth.roles.guard';
import { WishlistModule } from './modules/wishlist/wishlist.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.DATABASE_URL, {
      connectionFactory: (connection) => {
        console.log('MongoDB Connected:', connection.readyState);
        return connection;
      },
    }),
    AuthModule,
    ProductModule,
    WishlistModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
