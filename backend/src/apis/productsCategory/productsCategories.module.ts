import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from '../payment/entities/payment.entity';
import { ProductCategory } from './entities/productCategory.entity';
import { ProductsCategoriesResolver } from './productsCategories.resolver';
import { ProductsCategoriesService } from './productsCategories.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductCategory, //
      Payment,
    ]),
  ],
  providers: [
    ProductsCategoriesResolver, //
    ProductsCategoriesService,
  ],
})
export class ProductsCategoriesModule {}
