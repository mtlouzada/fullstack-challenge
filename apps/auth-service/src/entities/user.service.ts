import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
  ) { }

  async findByEmail(email: string) {
    return this.usersRepo.findOne({ where: { email } });
  }

  async findByEmailWithPassword(email: string) {
    return this.usersRepo.findOne({
      where: { email },
      select: ['id', 'email', 'name', 'password'],
    });
  }

  async create(name: string, email: string, password: string) {
    const hashed = await bcrypt.hash(password, 10);
    const user = this.usersRepo.create({ name, email, password: hashed });
    return await this.usersRepo.save(user);
  }

  async validateUser(email: string, password: string) {
    const user = await this.findByEmailWithPassword(email);
    if (!user) return null;

    const match = await bcrypt.compare(password, user.password);
    return match ? user : null;
  }

}
