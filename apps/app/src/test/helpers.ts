import { prisma } from '@slipstream-ui/db';

/** Creates a throwaway user and registers its id for cleanup. */
export async function makeUser(registry: string[], email: string) {
  const user = await prisma.user.create({
    data: { email, passwordHash: 'x:y' },
  });
  registry.push(user.id);
  return user;
}
