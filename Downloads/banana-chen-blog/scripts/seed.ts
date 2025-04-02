const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // Create sample timeline entries
  const timeline1 = await prisma.timeline.create({
    data: {
      date: new Date('2024-01-01'),
      description: 'First day of 2024',
      imageUrl: 'https://source.unsplash.com/random/800x600?new-year'
    }
  })

  const timeline2 = await prisma.timeline.create({
    data: {
      date: new Date('2024-02-14'),
      description: 'Valentine\'s Day',
      imageUrl: 'https://source.unsplash.com/random/800x600?love'
    }
  })

  // Create sample songs
  const song1 = await prisma.song.create({
    data: {
      title: 'Sample Song 1',
      artist: 'Artist 1',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      description: 'A beautiful song'
    }
  })

  const song2 = await prisma.song.create({
    data: {
      title: 'Sample Song 2',
      artist: 'Artist 2',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      description: 'Another great song'
    }
  })

  // Create sample letters
  const letter1 = await prisma.letter.create({
    data: {
      title: 'First Letter',
      content: 'This is a sample letter content.',
      date: new Date('2024-03-01')
    }
  })

  const letter2 = await prisma.letter.create({
    data: {
      title: 'Second Letter',
      content: 'Another sample letter content.',
      date: new Date('2024-03-15')
    }
  })

  console.log('Sample data created successfully!')
  console.log('Timeline entries:', timeline1, timeline2)
  console.log('Songs:', song1, song2)
  console.log('Letters:', letter1, letter2)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 