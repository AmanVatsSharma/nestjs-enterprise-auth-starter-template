import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Welcome to BharatERP API – see /docs!';
  }

  // getHtmlPage(): react.ReactNode{
  //   return <> 
  //   <div>
  //   hello worold
  //   </div>
  //   </>
  // }

  getHealth() {
    // This Function check sfor the health

    const healthStatus = {
      department: 'Health',
      message: "Ok",
      uptime: process.uptime().toLocaleString()
    }

    return healthStatus
  }
}
