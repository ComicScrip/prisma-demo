-- DropForeignKey
ALTER TABLE `Person` DROP FOREIGN KEY `Person_kingdomId_fkey`;

-- DropForeignKey
ALTER TABLE `Person` DROP FOREIGN KEY `Person_roleId_fkey`;

-- AlterTable
ALTER TABLE `Person` MODIFY `kingdomId` INTEGER NULL,
    MODIFY `roleId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Person` ADD CONSTRAINT `Person_kingdomId_fkey` FOREIGN KEY (`kingdomId`) REFERENCES `Kingdom`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Person` ADD CONSTRAINT `Person_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
