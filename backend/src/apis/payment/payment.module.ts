import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImaportService } from '../iamport/imaport.service';
import { User } from '../users/entities/user.entity';
// import { PointTransaction } from './entities/pointTransaction.entity';
import { Payment } from './entities/payment.entity';
import { PaymentsResolver } from './payment.resolver';
import { PaymentsService } from './payment.service';

@Module({
    imports: [
      TypeOrmModule.forFeature([
        Payment, //
        User,
      ]),
    ],
  providers: [
    PaymentsResolver, //
    PaymentsService,
    ImaportService,
  ],
})
export class PaymentsModule {}
