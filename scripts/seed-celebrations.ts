/**
 * Seed script for Celebration Packs and Celebrations
 * Run with: npx ts-node scripts/seed-celebrations.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding celebration packs and celebrations...\n');

  // Check if system packs already exist
  const existingPacks = await prisma.celebrationPack.findMany({
    where: { ownerId: null },
  });

  if (existingPacks.length > 0) {
    console.log('⚠️  System packs already exist, skipping seed.');
    console.log('   Packs found:', existingPacks.map((p) => p.name).join(', '));
    await prisma.$disconnect();
    return;
  }

  // ==================== BUDDHISM CELEBRATIONS PACK ====================
  const BuddhismPack = await prisma.celebrationPack.create({
    data: {
      name: 'Buddhism Celebrations',
      description: 'Important Buddhist holidays and observances',
      isDefault: true,
      ownerId: null,
    },
  });

  const buddhistCelebrations = [
    {
      name: 'Vesak',
      description: 'The birth, enlightenment (nirvana), and passing (parinirvana) of Gautama Buddha. Celebrated on the full moon of the lunar month of Vesak.',
      date: '05-15',
      icon: '🪷',
      category: 'religious',
    },
    {
      name: 'Magha Puja',
      description: 'Commemorates the gathering of 1,250 enlightened monks at Veruvan monastery. Also known as Sangha Day.',
      date: '02-15',
      icon: '🕉️',
      category: 'religious',
    },
    {
      name: 'Asalha Puja',
      description: 'Commemorates the Buddha\'s first sermon (Setting in Motion the Wheel of Dhamma) and the founding of the Sangha.',
      date: '07-15',
      icon: '☸️',
      category: 'religious',
    },
    {
      name: 'Buddhist New Year',
      description: 'Celebrated differently across traditions. Theravada tradition typically celebrates in April (mid-April, usually 13th-15th).',
      date: '04-14',
      icon: '🎊',
      category: 'religious',
    },
    {
      name: 'Dhamma Day',
      description: 'Celebrates the day the Buddha announced that he would pass away in three months. A day for reflection on impermanence.',
      date: '08-15',
      icon: '🕯️',
      category: 'religious',
    },
    {
      name: 'Kathina Ceremony',
      description: 'Robe offering ceremony to monks. Typically held during the rainy season retreat (Vassa).',
      date: '10-01',
      icon: '👔',
      category: 'religious',
    },
  ];

  for (const celebration of buddhistCelebrations) {
    await prisma.celebration.create({
      data: {
        packId: BuddhismPack.id,
        ownerId: null,
        ...celebration,
      },
    });
  }

  console.log(`✅ Created Buddhism Celebrations pack with ${buddhistCelebrations.length} celebrations`);

  // ==================== GLOBAL HOLIDAYS PACK ====================
  const GlobalPack = await prisma.celebrationPack.create({
    data: {
      name: 'Global Holidays',
      description: 'Common secular and cultural holidays celebrated worldwide',
      isDefault: true,
      ownerId: null,
    },
  });

  const globalCelebrations = [
    {
      name: "New Year's Day",
      description: 'The first day of the Gregorian calendar year',
      date: '01-01',
      icon: '🎆',
      category: 'secular',
    },
    {
      name: "Valentine's Day",
      description: 'Day of celebrating love and affection',
      date: '02-14',
      icon: '💝',
      category: 'secular',
    },
    {
      name: "April Fools' Day",
      description: 'Traditional day of pranks and hoaxes',
      date: '04-01',
      icon: '🤡',
      category: 'secular',
    },
    {
      name: 'Earth Day',
      description: 'International day for environmental awareness and action',
      date: '04-22',
      icon: '🌍',
      category: 'secular',
    },
    {
      name: 'International Day of Friendship',
      description: 'UN-designated day to promote friendship between peoples',
      date: '07-30',
      icon: '🤝',
      category: 'secular',
    },
    {
      name: 'Halloween',
      description: 'Eve of All Saints Day, celebrated with costumes and trick-or-treating',
      date: '10-31',
      icon: '🎃',
      category: 'cultural',
    },
    {
      name: 'Thanksgiving (US)',
      description: 'National holiday for giving thanks, typically observed on the fourth Thursday of November',
      date: '11-27',
      icon: '🦃',
      category: 'cultural',
    },
    {
      name: 'Christmas',
      description: 'Christian holiday celebrating the birth of Jesus Christ',
      date: '12-25',
      icon: '🎄',
      category: 'cultural',
    },
    {
      name: "New Year's Eve",
      description: 'The last day of the Gregorian calendar year',
      date: '12-31',
      icon: '🥂',
      category: 'secular',
    },
  ];

  for (const celebration of globalCelebrations) {
    await prisma.celebration.create({
      data: {
        packId: GlobalPack.id,
        ownerId: null,
        ...celebration,
      },
    });
  }

  console.log(`✅ Created Global Holidays pack with ${globalCelebrations.length} celebrations`);

  // ==================== CULTURAL CELEBRATIONS PACK ====================
  const CulturalPack = await prisma.celebrationPack.create({
    data: {
      name: 'Cultural Celebrations',
      description: 'Various cultural and traditional celebrations from around the world',
      isDefault: true,
      ownerId: null,
    },
  });

  const culturalCelebrations = [
    {
      name: 'Lunar New Year',
      description: 'Chinese New Year, celebrated across many Asian cultures. Marks the beginning of the lunar calendar year.',
      date: '01-29',
      icon: '🐉',
      category: 'cultural',
    },
    {
      name: 'Diwali',
      description: 'Hindu festival of lights, symbolizing the victory of light over darkness and good over evil.',
      date: '10-20',
      icon: '🪔',
      category: 'cultural',
    },
    {
      name: 'Hanukkah',
      description: 'Jewish festival of lights commemorating the rededication of the Second Temple in Jerusalem.',
      date: '12-18',
      icon: '🕎',
      category: 'cultural',
    },
    {
      name: 'Eid al-Fitr',
      description: 'Islamic holiday marking the end of Ramadan (the month of fasting).',
      date: '03-30',
      icon: '🌙',
      category: 'cultural',
    },
    {
      name: 'Easter',
      description: 'Christian holiday celebrating the resurrection of Jesus Christ',
      date: '04-20',
      icon: '🐰',
      category: 'cultural',
    },
    {
      name: 'Nowruz',
      description: 'Persian New Year, celebrating the spring equinox and new beginning.',
      date: '03-20',
      icon: '🌸',
      category: 'cultural',
    },
  ];

  for (const celebration of culturalCelebrations) {
    await prisma.celebration.create({
      data: {
        packId: CulturalPack.id,
        ownerId: null,
        ...celebration,
      },
    });
  }

  console.log(`✅ Created Cultural Celebrations pack with ${culturalCelebrations.length} celebrations`);

  console.log('\n🎉 Seed completed successfully!');
  console.log(`   Total packs: 3`);
  console.log(`   Total celebrations: ${buddhistCelebrations.length + globalCelebrations.length + culturalCelebrations.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
