import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('Connecting using DATABASE_URL:', process.env.DATABASE_URL);
  const article = await prisma.article.create({
    data: {
      title: 'Hello Supabase',
      url: 'https://example.com/hello-' + Date.now(),
      source: 'Guidly',
      tags: ['intro', 'supabase'],
    },
  });
  console.log('Created article:', article);
}

main()
  .catch((err) => {
    console.error('Error running check:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


