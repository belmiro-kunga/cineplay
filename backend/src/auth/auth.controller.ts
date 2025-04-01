import { Controller, Post, Body, UseGuards, Request, Get, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { FacebookAuthGuard } from './guards/facebook-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { OAuthLoginDto } from './dto/oauth-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Post('oauth/login')
  async oauthLogin(@Body() oauthLoginDto: OAuthLoginDto) {
    return this.authService.oauthLogin(oauthLoginDto);
  }

  // Rotas para autenticação direta com Google
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleAuth() {
    // O redirecionamento é tratado pela biblioteca Passport
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  googleAuthRedirect(@Req() req, @Res() res) {
    // Aqui, poderíamos usar o token
    const { user } = req;
    // Em um caso real, redirecionaríamos para a aplicação frontend com o token
    return res.redirect(`http://localhost:3000/auth/callback?access_token=${user.accessToken}`);
  }

  // Rotas para autenticação direta com Facebook
  @Get('facebook')
  @UseGuards(FacebookAuthGuard)
  facebookAuth() {
    // O redirecionamento é tratado pela biblioteca Passport
  }

  @Get('facebook/callback')
  @UseGuards(FacebookAuthGuard)
  facebookAuthRedirect(@Req() req, @Res() res) {
    // Aqui, poderíamos usar o token
    const { user } = req;
    // Em um caso real, redirecionaríamos para a aplicação frontend com o token
    return res.redirect(`http://localhost:3000/auth/callback?access_token=${user.accessToken}`);
  }
} 