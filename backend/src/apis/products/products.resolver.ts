import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CreateProductInput } from "./dto/create-product.input";
import { UpdateProductInput } from "./dto/update-product.input";
import { Product } from "./entities/product.entity";
import { ProductsService } from "./products.service";

@Resolver()
export class ProductsResolver {
  constructor(
    //의존성주입  여기서 사용하게 가져오는것.
    private readonly productsService: ProductsService //
  ) {}

  ///-----------------------------///

  @Query(() => [Product])
  fetchProducts(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  ///-----------------------------///

  @Query(() => Product)
  fetchProduct(
    @Args("productId") productId: string //
  ): Promise<Product> {
    return this.productsService.findOne({ productId });
  }

  ///-----------------------------///

  @Mutation(() => Product)
  createProduct(
    @Args("createProductInput")
    createProductInput: CreateProductInput
  ): Promise<Product> {
    return this.productsService.create({ createProductInput });
  }

  ///-----------------------------///

  @Mutation(() => Product)
  async updateProduct(
    @Args("productId") productId: string,
    @Args("updateProductInput") updateProductInput: UpdateProductInput
  ): Promise<Product> {
    const product = await this.productsService.findOne({ productId });

    this.productsService.checkSoldout({ product });

    return this.productsService.update({ product, updateProductInput });
  }

  ///-----------------------------///
  @Mutation(() => Boolean)
  restoreProduct(@Args("productId") productId: string) {
    return this.productsService.restore({ productId });
  }

  ///-----------------------------///
  @Mutation(() => Boolean)
  deleteProduct(
    @Args("productId") productId: string //
  ): Promise<boolean> {
    return this.productsService.delete({ productId });
  }

  ///-----------------------------///
  @Query(() => [Product])
  fetchProductsWithDeleted() {
    return this.productsService.fetchProductsWithDeleted();
  }
}
