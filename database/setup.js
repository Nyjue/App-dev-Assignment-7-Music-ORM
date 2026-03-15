const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
require('dotenv').config();

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'music_library.db'),
  logging: false
});

const Track = sequelize.define('Track', {
  trackId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  songTitle: {
    type: DataTypes.STRING,
    allowNull: false
  },
  artistName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  albumName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  genre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  releaseYear: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: false
});

async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    await sequelize.sync({ force: true });
    console.log('✅ Database tables created successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  } finally {
    await sequelize.close();
    console.log('🔒 Database connection closed.');
  }
}

if (require.main === module) {
  initializeDatabase();
}

module.exports = { sequelize, Track };