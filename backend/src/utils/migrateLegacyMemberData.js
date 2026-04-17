const Member = require("../models/Member");

async function migrateLegacyMemberData() {
  const members = await Member.find({
    $or: [
      { phoneNumber: { $exists: false } },
      { phoneNumber: "" },
      { monthlyFees: { $exists: false } },
      { feeStatus: { $exists: false } },
    ],
  });

  let migratedCount = 0;

  for (const member of members) {
    let shouldSave = false;

    if ((!member.phoneNumber || !member.phoneNumber.trim()) && member.phone?.trim()) {
      member.phoneNumber = member.phone.trim();
      shouldSave = true;
    }

    if ((!member.phone || !member.phone.trim()) && member.phoneNumber?.trim()) {
      member.phone = member.phoneNumber.trim();
      shouldSave = true;
    }

    if ((!member.monthlyFees || member.monthlyFees.size === 0) && member.feeStatus?.size) {
      member.monthlyFees = new Map(member.feeStatus);
      shouldSave = true;
    }

    if ((!member.monthlyFees || member.monthlyFees.size === 0) && member.payments?.size) {
      member.monthlyFees = new Map(member.payments);
      shouldSave = true;
    }

    if ((!member.feeStatus || member.feeStatus.size === 0) && member.monthlyFees?.size) {
      member.feeStatus = new Map(member.monthlyFees);
      shouldSave = true;
    }

    if ((!member.payments || member.payments.size === 0) && member.monthlyFees?.size) {
      member.payments = new Map(member.monthlyFees);
      shouldSave = true;
    }

    if (shouldSave) {
      await member.save();
      migratedCount += 1;
    }
  }

  if (migratedCount > 0) {
    console.log(`Migrated ${migratedCount} member records to the latest schema.`);
  }
}

module.exports = migrateLegacyMemberData;
