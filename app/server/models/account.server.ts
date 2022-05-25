import type { Account } from '@prisma/client';

import { db } from '../database/db.server';

export async function getUserById(id: Account['id']) {
  return db.account.findUnique({ where: { id } });
}

export async function getUserByUserName(username: Account['username']) {
  return db.account.findUnique({ where: { username } });
}
