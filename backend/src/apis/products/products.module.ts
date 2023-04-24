import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductAllergy } from '../productsAllergy/productAllergy.entity';
import { ProductCategory } from '../productsCategory/entities/productCategory.entity';
import { Payment } from '../payment/entities/payment.entity';
import { Product } from './entities/product.entity';
import { ProductsResolver } from './products.resolver';
import { ProductsService } from './products.service';
import { ProductImage } from '../productsImage/entities/productImage.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product, //
      Payment,
      ProductCategory,
      ProductImage,
      ProductAllergy,

    ]),
  ],

  providers: [
    ProductsResolver, //
    ProductsService,
  ],
})
export class ProductsModule {}
