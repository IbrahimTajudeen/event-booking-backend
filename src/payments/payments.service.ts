/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import {  Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { User } from 'src/common/entities/user.entity';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  constructor(@InjectRepository(Payment) private readonly paymentsRepository: Repository<Payment>) {}

  create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    this.logger.log('Creating a new payment');
    const payment = this.paymentsRepository.create({
      booking: createPaymentDto.booking,
      user: createPaymentDto.user,
      amount: createPaymentDto.amount,
    });
    return this.paymentsRepository.save(payment);
  }

  async userPayments(user: User): Promise<Payment[]> {
    this.logger.log('Retrieving all payments');
    return await this.paymentsRepository.find({ where: { user: { id: user.id, role: user.role } } });
  }

  async allPayments(): Promise<Payment[]> {
    this.logger.log('Retrieving all payments');
    return await this.paymentsRepository.find();
  }

  async findOne(id: number): Promise<Payment | null> {
    this.logger.log(`Retrieving payment with id ${id}`);
    return await this.paymentsRepository.findOneBy({ id: id });
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto): Promise<Payment | null> {
    this.logger.log(`Updating payment with id ${id}`);
    await this.paymentsRepository.update(id, { status: updatePaymentDto.status });
    return this.findOne(id);
  }

  async remove(id: number): Promise<string> {
    this.logger.log(`Removing payment with id ${id}`);
    await this.paymentsRepository.delete(id);
    return `Payment with the id: #${id} has been deleted successfully`;
  }
}
