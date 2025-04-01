import { Injectable, UnauthorizedException, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { OAuthLoginDto } from './dto/oauth-login.dto';
import { QRCodeGenerateDto, QRCodeValidateDto } from './dto/qrcode-auth.dto';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
// import * as qrcode from 'qrcode';
// import * as speakeasy from 'speakeasy';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';

@Injectable()
export class AuthService {
  // Simulação de armazenamento de tokens para redefinição de senha
  private passwordResetTokens: Map<string, { userId: string; expiresAt: Date }> = new Map();
  private redisClient;
  
  // Armazenamento temporário para tokens QR Code (em produção, usar Redis)
  private qrCodeTokens: Map<string, { userId: string; expiresAt: Date }> = new Map();

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.initRedis();
  }

  private async initRedis() {
    try {
      this.redisClient = createClient({
        url: `redis://${this.configService.get('REDIS_HOST')}:${this.configService.get('REDIS_PORT')}`,
      });
      
      this.redisClient.on('error', (err) => console.log('Redis Client Error', err));
      
      await this.redisClient.connect();
      console.log('Redis conectado com sucesso!');
    } catch (error) {
      console.error('Erro ao conectar ao Redis:', error);
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    
    return null;
  }

  async login(user: any) {
    // Atualizar o último login do usuário
    await this.usersService.updateLastLogin(user.id);
    
    const payload = {
      email: user.email,
      sub: user.id,
      isAdmin: user.isAdmin,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
        role: user.role,
        profilePicture: user.profilePicture,
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

  // Métodos para autenticação via QR Code - Implementação simplificada
  async generateQRCode(qrCodeDto: QRCodeGenerateDto) {
    const { userId } = qrCodeDto;
    
    // Verificar se o usuário existe
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    
    // Gerar um token único para referência
    const qrToken = uuidv4();
    
    // Configurar a expiração (5 minutos)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);
    
    try {
      // Tentar armazenar no Redis se possível
      if (this.redisClient && this.redisClient.isReady) {
        await this.redisClient.set(
          `qrcode:${qrToken}`, 
          JSON.stringify({
            userId: user.id,
          }),
          { EX: 300 } // 5 minutos (300 segundos)
        );
      } else {
        // Fallback para armazenamento em memória
        this.qrCodeTokens.set(qrToken, {
          userId: user.id,
          expiresAt
        });
      }
      
      // Como não temos a biblioteca QRCode, retornamos apenas o token
      // Em um cenário real, esse token seria convertido em um QR Code
      return {
        token: qrToken,
        loginUrl: `${this.configService.get('APP_URL', 'http://localhost:3003')}/auth/qrcode/validate/${qrToken}`,
        expiresIn: 300, // 5 minutos em segundos
        message: 'Use este token para autenticação por QR Code. Em uma implementação completa, este seria um QR Code.',
      };
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      throw new BadRequestException('Erro ao gerar QR Code');
    }
  }
  
  async validateQRCode(validateDto: QRCodeValidateDto) {
    const { token } = validateDto;
    
    let userId = null;
    let isValid = false;
    
    try {
      // Tentar buscar do Redis se possível
      if (this.redisClient && this.redisClient.isReady) {
        const tokenData = await this.redisClient.get(`qrcode:${token}`);
        if (tokenData) {
          const data = JSON.parse(tokenData);
          userId = data.userId;
          isValid = true;
          // Apagar o token do Redis para uso único
          await this.redisClient.del(`qrcode:${token}`);
        }
      } else {
        // Fallback para busca em memória
        if (this.qrCodeTokens.has(token)) {
          const data = this.qrCodeTokens.get(token);
          if (data.expiresAt > new Date()) {
            userId = data.userId;
            isValid = true;
            // Apagar o token da memória para uso único
            this.qrCodeTokens.delete(token);
          }
        }
      }
      
      if (!isValid) {
        throw new UnauthorizedException('QR Code inválido ou expirado');
      }
      
      // Buscar o usuário
      const user = await this.usersService.findOne(userId);
      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }
      
      // Atualizar o último login do usuário
      await this.usersService.updateLastLogin(userId);
      
      // Gerar JWT token para o usuário
      const payload = {
        email: user.email,
        sub: user.id,
        isAdmin: user.isAdmin,
        role: user.role,
      };
      
      return {
        accessToken: this.jwtService.sign(payload),
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin,
          role: user.role,
          profilePicture: user.profilePicture,
        },
      };
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof NotFoundException) {
        throw error;
      }
      console.error('Erro ao validar QR Code:', error);
      throw new BadRequestException('Erro ao validar QR Code');
    }
  }
  
  async checkQRCodeStatus(token: string) {
    let isValid = false;
    
    try {
      // Tentar buscar do Redis se possível
      if (this.redisClient && this.redisClient.isReady) {
        const tokenData = await this.redisClient.get(`qrcode:${token}`);
        isValid = !!tokenData;
      } else {
        // Fallback para busca em memória
        if (this.qrCodeTokens.has(token)) {
          const data = this.qrCodeTokens.get(token);
          isValid = data.expiresAt > new Date();
        }
      }
      
      return { 
        valid: isValid, 
        message: isValid ? 'QR Code válido' : 'QR Code inválido ou expirado' 
      };
    } catch (error) {
      console.error('Erro ao verificar status do QR Code:', error);
      return { 
        valid: false, 
        message: 'Erro ao verificar status do QR Code' 
      };
    }
  }
} 