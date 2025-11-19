import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>
  ) {}

  async register(dto) {
    const exists = await this.usersRepo.findOne({ where: { email: dto.email } });
    if (exists) throw new Error("Email already exists");

    const hash = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepo.create({ email: dto.email, password: hash });
    await this.usersRepo.save(user);

    return { message: "User created successfully" };
  }

  async login(dto) {
    const user = await this.usersRepo.findOne({ where: { email: dto.email } });

    if (!user) throw new Error("Invalid credentials");

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new Error("Invalid credentials");

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return { token };
  }
}
