import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }

  @Get()
  getRoot() {
    return {
      message: 'Welcome to BharatERP API 🚀',
      Docs: '/docs',
      version: '1.0.0'
    }
  }

    @Get('site')
  getLandingPage(@Res() res: Response) {
    res.send(`
      <html>
        <head>
          <title>BharatERP API</title>
          <style>
            body { font-family: Arial; padding: 2rem; text-align: center; }
            h1 { color: #2E86C1; }
            a { color: #27AE60; font-size: 1.2rem; text-decoration: none; }
          </style>
        </head>
        <body>
          <h1>🚀 Welcome to BharatERP API</h1>
          <p>Your enterprise SaaS backend is running.</p>
          <p><a href="/docs">View API Documentation</a></p>
        </body>
      </html>
    `);
  }

  @Get('health')
  getHealth() {
    return this.appService.getHealth();
  }
}
