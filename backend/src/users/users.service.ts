import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { CreateUserDto, UpdateUserDto, ChangeRoleDto, ChangeAdminStatusDto } from './dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Verificando se usuário já existe
    const userExists = await this.findByEmail(createUserDto.email);
    if (userExists) {
      throw new BadRequestException('Este email já está em uso');
    }

    // Se a senha foi fornecida, vamos criptografá-la
    if (createUserDto.password) {
      createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    }

    const newUser = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      select: ['id', 'name', 'email', 'isAdmin', 'role', 'profilePicture', 'isEmailVerified', 'createdAt', 'updatedAt', 'lastLogin']
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ 
      where: { id },
      select: ['id', 'name', 'email', 'isAdmin', 'role', 'profilePicture', 'isEmailVerified', 'createdAt', 'updatedAt', 'lastLogin']
    });
    
    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }
    
    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    
    // Se a senha foi fornecida, vamos criptografá-la
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    
    this.usersRepository.merge(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async changeRole(id: string, changeRoleDto: ChangeRoleDto): Promise<User> {
    const user = await this.findOne(id);
    user.role = changeRoleDto.role;
    
    // Se o usuário está recebendo a role ADMIN, também define isAdmin como true
    if (changeRoleDto.role === UserRole.ADMIN) {
      user.isAdmin = true;
    }
    
    return this.usersRepository.save(user);
  }

  async changeAdminStatus(id: string, changeAdminStatusDto: ChangeAdminStatusDto): Promise<User> {
    const user = await this.findOne(id);
    user.isAdmin = changeAdminStatusDto.isAdmin;
    
    // Se isAdmin está sendo definido como true, também atualiza role para ADMIN
    if (changeAdminStatusDto.isAdmin) {
      user.role = UserRole.ADMIN;
    }
    
    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.usersRepository.update(id, {
      lastLogin: new Date()
    });
  }
} 