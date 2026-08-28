const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning up bot spam...");
  const rawUpdated = await prisma.$executeRaw`
    UPDATE "task_completions"
    SET 
      "status" = 'REJECTED'::"TaskCompletionStatus",
      "rejectedAt" = NOW()
    WHERE 
      "status" = 'PENDING'::"TaskCompletionStatus"
      AND "proof" LIKE 'Telegram: @User0x%'
  `;
  console.log(`Successfully rejected ${rawUpdated} bot submissions!`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
