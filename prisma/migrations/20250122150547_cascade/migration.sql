-- DropForeignKey
ALTER TABLE "cms"."ticketComments" DROP CONSTRAINT "ticketComments_ticketId_fkey";

-- AddForeignKey
ALTER TABLE "cms"."ticketComments" ADD CONSTRAINT "ticketComments_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "cms"."tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
