import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { CacheModule, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./apis/users/users.module";
import { ProductsModule } from "./apis/products/products.module";
import { ProductsCategoriesModule } from "./apis/productsCategory/productsCategories.module";
import { AuthModule } from "./apis/auth/auth.module";
import { JwtAccessStrategy } from "./commons/auth/jwt-access.strategy";
import { JwtRefreshStrategy } from "./commons/auth/jwt-refresh.strategy";
import { PaymentsModule } from "./apis/payment/payment.module";
import { FilesModule } from "./apis/files/file.module";
// import { productImagemodule } from './apis/productsImage/productImage.module';
import { RedisClientOptions } from "redis";
import * as redisStore from "cache-manager-redis-store";
import { AppController } from "./app.controller";

@Module({
  imports: [
    AuthModule,
    FilesModule,
    // productImagemodule,
    ProductsModule,
    ProductsCategoriesModule,
    PaymentsModule,
    UsersModule,
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      context: ({ req, res }) => ({ req, res }),
      driver: ApolloDriver,
      autoSchemaFile: "src/commons/graphql/schema.gql",
    }),
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_TYPE as "mysql",
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
      entities: [__dirname + "/apis/**/*.entity.*"],
      synchronize: true,
      logging: true,
    }),
    // CacheModule.register<RedisClientOptions>({
    //   store: redisStore,
    //   url: 'redis://10.125.145.3:6379',
    //   isGlobal: true,
    // })
  ],
  providers: [
    JwtAccessStrategy, //
    JwtRefreshStrategy,
  ],
  controllers: [AppController],
})
export class AppModule {}
