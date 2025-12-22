import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    const connectionString = `${process.env.DATABASE_URL}`;
    const adapter = new PrismaPg({ connectionString });
    super({ adapter });
  }
}

// import { Injectable } from '@nestjs/common';
// import { PrismaClient } from './generated/prisma/client.js';
// import { PrismaPg } from '@prisma/adapter-pg';


// const connectionString = `${process.env.DATABASE_URL}`;

// const adapter = new PrismaPg({ connectionString });
// const prisma = new PrismaClient({ adapter });

// @Injectable()
// export class PrismaService extends PrismaClient {
//   constructor() {
//     const adapter = new PrismaPg({
//       connectionString,
//     });
//     super({ adapter });
//   }
// }