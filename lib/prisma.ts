import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

let prisma: PrismaClient;

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/postgres';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
prisma = new PrismaClient({ adapter } as any);

export default prisma;
