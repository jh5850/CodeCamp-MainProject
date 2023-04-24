import {
  HttpException,
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "./entities/product.entity";

import { Payment } from "../payment/entities/payment.entity";
import {
  IProductsServiceCheckSoldout,
  IProductsServiceCreate,
  IProductsServiceDelete,
  IProductsServiceFindOne,
  IProductsServiceUpdate,
} from "./interfaces/products-service.interface";
import { ProductAllergy } from "../productsAllergy/productAllergy.entity";
import { ProductCategory } from "../productsCategory/entities/productCategory.entity";
import { ProductImage } from "../productsImage/entities/productImage.entity";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>, //

    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>, //

    @InjectRepository(ProductAllergy)
    private readonly ProductAllergyRepository: Repository<ProductAllergy>, //  ????

    @InjectRepository(ProductCategory)
    private readonly ProductCategoryRepository: Repository<ProductCategory> // @InjectRepository(ProductImage) // private readonly ProductImageRepository: Repository<ProductImage>,
  ) {}

  ///-----------------------------///
  findAll(): Promise<Product[]> {
    return this.productsRepository.find({
      relations: ["productCategory", "productAllergy"],
    });
  }
  ///-----------------------------///
  findOne({ productId }: IProductsServiceFindOne): Promise<Product> {
    return this.productsRepository.findOne({
      where: { id: productId },
      relations: ["productCategory", "productAllergy"],
    });
  }
  ///-----------------------------///

  // withDeleted():Promise<Product[]> {
  //   return this.productsRepository.createQueryBuilder().withDeleted().getMany();
  // }

  ///-----------------------------///

  // const { payment, ProductIngredient, ...product } = createProductInput;

  // const result = await this.paymentRepository.save({
  //   ...payment,
  // });

  // const result2 = await this.productsRepository.save({
  //   ...product,
  //   payment: result,
  //   ProductIngredient: { id: id },
  // });

  async create({
    createProductInput,
  }: IProductsServiceCreate): Promise<Product> {
    const { ProductCategoryId, ProductAllergy, ...Product } =
      createProductInput;
    //     // 수정필요
    //   for (let i = 0; i < img_url.length; i++) {
    //   await this.ProductImageRepository.save({
    //     url: img_url[i],
    //     product: {
    //       ...Product,
    //     },
    //   });
    // }
    const category = await this.ProductCategoryRepository.findOne({
      where: { id: ProductCategoryId },
    });

    const temp = [];
    for (let i = 0; i < ProductAllergy.length; i++) {
      const tagname = ProductAllergy[i];
      const prevTag = await this.ProductAllergyRepository.findOne({
        where: { name: tagname },
      });

      // 기존에 태그가 존재한다면
      if (prevTag) {
        temp.push(prevTag); // { id: aslkdfasjk-asjk, name: "전자제품" }

        // 기존에 태그가 없었다면
      } else {
        const newTag = await this.ProductAllergyRepository.save({
          name: tagname,
        });

        console.log(newTag); // { id: aslkdfasjk-asjk, name: "전자제품" }
        temp.push(newTag);
      }
    }

    const result3 = await this.productsRepository.save({
      productCategory: category,
      productAllergy: temp,
      ...Product,
    });

    return result3;
  }
  ///-----------------------------///

  async update({
    product,
    updateProductInput,
  }: IProductsServiceUpdate): Promise<Product> {
    const { ProductCategoryId, ...Product } = updateProductInput;

    const category = await this.ProductCategoryRepository.findOne({
      where: { id: ProductCategoryId },
    });

    const temp = [];
    for (let i = 0; i < ProductAllergy.length; i++) {
      const tagname = ProductAllergy[i];
      const prevTag = await this.ProductAllergyRepository.findOne({
        where: { name: tagname },
      });

      // 기존에 태그가 존재한다면
      if (prevTag) {
        temp.push(prevTag); // { id: aslkdfasjk-asjk, name: "전자제품" }

        // 기존에 태그가 없었다면
      } else {
        const newTag = await this.ProductAllergyRepository.save({
          name: tagname,
        });

        console.log(newTag); // { id: aslkdfasjk-asjk, name: "전자제품" }
        temp.push(newTag);
      }
    }

    const result = this.productsRepository.save({
      ...product,
      productCategory: category,
      productAllergy: temp,
      // 수정 후 수정되지 않은 다른 결과값까지 모두 받고 싶을 때 사용
      ...Product,
    });

    return result;
  }

  ///-----------------------------///

  async restore({ productId }) {
    const result = await this.productsRepository.restore({
      id: productId,
    });
    return result.affected ? true : false;
  }

  ///-----------------------------///
  checkSoldout({ product }: IProductsServiceCheckSoldout): void {
    if (product.isSoldout)
      throw new UnprocessableEntityException("이미 판매 완료된 상품입니다");

    // if (product.isSoldout) {
    //   throw new HttpException(
    //     '이미 판매 완료된 상품입니다.',
    //     HttpStatus.UNPROCESSABLE_ENTITY,
    //   );
    // }
  }

  async delete({ productId }: IProductsServiceDelete): Promise<boolean> {
    // 1. 실제 삭제
    // const result = await this.productsRepository.delete({ id: productId });
    // return result.affected ? true : false;

    // 2. 소프트 삭제(직접 구현) - isDeleted
    // this.productsRepository.update({ id: productId }, { isDeleted: true })

    // 3. 소프트 삭제(직접 구현) - deletedAt
    // this.productsRepository.update({ id: productId }, { deletedAt: new Date() });

    // 4. 소프트 삭제(TypeORM 제공) - softRemove
    // this.productsRepository.softRemove({ id: productId }); // id로만 삭제 가능

    // 5. 소프트 삭제(TypeORM 제공) - softDelete
    const result = await this.productsRepository.softDelete({ id: productId }); // 다른 컬럼으로도 삭제 가능
    return result.affected ? true : false; //삭제의 결과는 객체로 나와서 확인하기위해서 .affected를 사용!!
  } // 삭제이루어진게 있다면 true 없으면 false

  fetchProductsWithDeleted(): Promise<Product[]> {
    return this.productsRepository.find({
      withDeleted: true, //???
    });
  }
}
