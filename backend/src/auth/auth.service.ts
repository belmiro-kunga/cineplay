import { Injectable, UnauthorizedException, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { OAuthLoginDto } from './dto/oauth-login.dto';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

@Injectable()
export class AuthService {
  // Simulação de armazenamento de tokens para redefinição de senha
  private passwordResetTokens: Map<string, { userId: string; expiresAt: Date }> = new Map();

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    
    return null;
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      isAdmin: user.isAdmin,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    // Verifica se o email já está em uso
    const userExists = await this.usersService.findByEmail(registerDto.email);
    if (userExists) {
      throw new ConflictException('Este email já está em uso');
    }

    // Cria um novo usuário
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const newUser = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });

    // Remove a senha do objeto retornado
    const { password, ...result } = newUser;
    
    // Gera um token JWT
    const payload = {
      email: result.email,
      sub: result.id,
      isAdmin: result.isAdmin,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: result,
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const user = await this.usersService.findByEmail(email);
    
    // Mesmo que o usuário não exista, retornamos sucesso
    // para evitar vazamento de informação
    if (!user) {
      return { success: true, message: 'Se o email existir, você receberá um link de recuperação' };
    }
    
    // Gerar um token único
    const token = uuidv4();
    
    // Armazenar o token com o ID do usuário e data de expiração (24 horas)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    
    this.passwordResetTokens.set(token, { 
      userId: user.id, 
      expiresAt 
    });
    
    // Em um ambiente real, um email seria enviado ao usuário
    // com um link contendo o token
    console.log(`Link de recuperação: /auth/reset-password?token=${token}`);
    
    return { 
      success: true, 
      message: 'Se o email existir, você receberá um link de recuperação',
      // Em desenvolvimento, retornamos o token para facilitar o teste
      token: process.env.NODE_ENV === 'development' ? token : undefined
    };
  }
  
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { token, password, passwordConfirmation } = resetPasswordDto;
    
    // Verificar se o token existe
    if (!this.passwordResetTokens.has(token)) {
      throw new NotFoundException('Token inválido ou expirado');
    }
    
    // Verificar se o token não expirou
    const { userId, expiresAt } = this.passwordResetTokens.get(token);
    if (expiresAt < new Date()) {
      this.passwordResetTokens.delete(token);
      throw new BadRequestException('Token expirado');
    }
    
    // Verificar se as senhas coincidem
    if (password !== passwordConfirmation) {
      throw new BadRequestException('As senhas não coincidem');
    }
    
    // Atualizar a senha do usuário
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.usersService.update(userId, { password: hashedPassword });
    
    // Remover o token usado
    this.passwordResetTokens.delete(token);
    
    return { success: true, message: 'Senha atualizada com sucesso' };
  }

  async oauthLogin(oauthLoginDto: OAuthLoginDto) {
    const { provider, accessToken } = oauthLoginDto;
    
    let userInfo;
    
    try {
      if (provider === 'google') {
        userInfo = await this.getGoogleUserInfo(accessToken);
      } else if (provider === 'facebook') {
        userInfo = await this.getFacebookUserInfo(accessToken);
      } else {
        throw new BadRequestException('Provedor não suportado');
      }
      
      // Verificar se já existe um usuário com este email
      let user = await this.usersService.findByEmail(userInfo.email);
      
      if (!user) {
        // Criar um novo usuário se não existir
        const randomPassword = uuidv4();
        const hashedPassword = await bcrypt.hash(randomPassword, 10);
        
        user = await this.usersService.create({
          email: userInfo.email,
          name: userInfo.name,
          password: hashedPassword,
          // Foto de perfil pode ser adicionada se a entidade User suportar
        });
      }
      
      // Gerar token JWT
      const payload = {
        email: user.email,
        sub: user.id,
        isAdmin: user.isAdmin,
      };
      
      return {
        accessToken: this.jwtService.sign(payload),
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin,
        },
      };
      
    } catch (error) {
      throw new UnauthorizedException('Falha na autenticação com provedor externo');
    }
  }
  
  private async getGoogleUserInfo(accessToken: string) {
    try {
      const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      
      return {
        email: response.data.email,
        name: response.data.name,
        picture: response.data.picture,
      };
    } catch (error) {
      throw new UnauthorizedException('Token do Google inválido');
    }
  }
  
  private async getFacebookUserInfo(accessToken: string) {
    try {
      const response = await axios.get('https://graph.facebook.com/me', {
        params: {
          fields: 'id,name,email,picture',
          access_token: accessToken,
        },
      });
      
      return {
        email: response.data.email,
        name: response.data.name,
        picture: response.data.picture?.data?.url,
      };
    } catch (error) {
      throw new UnauthorizedException('Token do Facebook inválido');
    }
  }
} 