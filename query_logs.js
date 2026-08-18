const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const events = await prisma.monitoringEvent.findMany({
    where: { type: 'API_EXCEPTION' },
    orderBy: { createdAt: 'desc' },
    take: 3
  });
  console.log(JSON.stringify(events, null, 2));
}
run().finally(() => prisma.$disconnect());
