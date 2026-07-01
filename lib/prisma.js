import 'dotenv/config'
import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import {neonConfig} from "@neondatabase/serverless"

import ws from "ws";
neonConfig.webSocketConstructor=ws
// to work with vercel or cloudflare workers
neonConfig.poolQueryViaFetch=true

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL,
})
const prisma = global.prisma || new PrismaClient({adapter})

if(process.env.NODE_ENV==="development") global.prisma=prisma;

export default prisma;