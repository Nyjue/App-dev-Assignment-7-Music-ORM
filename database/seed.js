const { Track, sequelize } = require('./setup.js');

const sampleTracks = [
  {
    songTitle: "Bohemian Rhapsody",
    artistName: "Queen",
    albumName: "A Night at the Opera",
    genre: "Rock",
    duration: 354,
    releaseYear: 1975
  },
  {
    songTitle: "Hotel California",
    artistName: "Eagles",
    albumName: "Hotel California",
    genre: "Rock",
    duration: 391,
    releaseYear: 1976
  },
  {
    songTitle: "Shape of You",
    artistName: "Ed Sheeran",
    albumName: "÷ (Divide)",
    genre: "Pop",
    duration: 234,
    releaseYear: 2017
  },
  {
    songTitle: "Blinding Lights",
    artistName: "The Weeknd",
    albumName: "After Hours",
    genre: "Synth-pop",
    duration: 200,
    releaseYear: 2019
  },
  {
    songTitle: "Billie Jean",
    artistName: "Michael Jackson",
    albumName: "Thriller",
    genre: "Pop",
    duration: 294,
    releaseYear: 1982
  }
];

async function seedDatabase() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established.');
    
    // Clear existing data
    await Track.destroy({ where: {}, truncate: true });
    console.log('🗑️  Cleared existing tracks');
    
    // Insert sample data
    const created = await Track.bulkCreate(sampleTracks);
    console.log(`✅ Successfully seeded ${created.length} tracks`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await sequelize.close();
    console.log('🔒 Database connection closed.');
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;