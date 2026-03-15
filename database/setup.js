// database/setup.js
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
require('dotenv').config();

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'music_library.db'),
  logging: false
});

// Define Track Model
const Track = sequelize.define('Track', {
  trackId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  songTitle: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  artistName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  albumName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  genre: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  releaseYear: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1900,
      max: new Date().getFullYear()
    }
  }
}, {
  timestamps: false
});

// Async function to initialize database
async function initializeDatabase() {
  try {
    // Test the connection
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Sync all models with database
    await sequelize.sync({ force: true });
    console.log('✅ Database tables created successfully.');

  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  } finally {
    // Close the connection
    await sequelize.close();
    console.log('🔒 Database connection closed.');
  }
}

// Run if this file is executed directly
if (require.main === module) {
  initializeDatabase();
}

module.exports = { sequelize, Track };