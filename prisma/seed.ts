/* eslint-disable quotes */
import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

async function seed() {
  await db.account.create({
    data: {
      username: 'me@yandif.com',
      // this is a hashed version of "123123"
      passwordHash:
        'MjZhdmkwa0ZCaQ==Yzk5OGVhZTQ1ZjNhNDVkMjM4MTlkYzgzOWM5ZDkyODM=',
    },
  });
}

seed();
