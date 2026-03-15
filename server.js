// server.js
const express = require('express');
const { sequelize, Track } = require('./database/setup.js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Test database connection on startup
sequelize.authenticate()
  .then(() => console.log('✅ Database connected'))
  .catch(err => console.error('❌ Database connection error:', err));

// ========== API ENDPOINTS ==========

// GET /api/tracks - Get all tracks
app.get('/api/tracks', async (req, res) => {
  try {
    const tracks = await Track.findAll({
      order: [['songTitle', 'ASC']]
    });
    res.json({
      success: true,
      count: tracks.length,
      data: tracks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tracks'
    });
  }
});

// GET /api/tracks/:id - Get single track by ID
app.get('/api/tracks/:id', async (req, res) => {
  try {
    const track = await Track.findByPk(req.params.id);
    
    if (!track) {
      return res.status(404).json({
        success: false,
        error: 'Track not found'
      });
    }
    
    res.json({
      success: true,
      data: track
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch track'
    });
  }
});

// POST /api/tracks - Create a new track
app.post('/api/tracks', async (req, res) => {
  try {
    const { songTitle, artistName, albumName, genre, duration, releaseYear } = req.body;
    
    // Input validation
    const missingFields = [];
    if (!songTitle) missingFields.push('songTitle');
    if (!artistName) missingFields.push('artistName');
    if (!albumName) missingFields.push('albumName');
    if (!genre) missingFields.push('genre');
    if (!duration) missingFields.push('duration');
    if (!releaseYear) missingFields.push('releaseYear');
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }
    
    // Additional validation
    if (duration < 1) {
      return res.status(400).json({
        success: false,
        error: 'Duration must be at least 1 second'
      });
    }
    
    if (releaseYear < 1900 || releaseYear > new Date().getFullYear()) {
      return res.status(400).json({
        success: false,
        error: `Release year must be between 1900 and ${new Date().getFullYear()}`
      });
    }
    
    const newTrack = await Track.create({
      songTitle,
      artistName,
      albumName,
      genre,
      duration,
      releaseYear
    });
    
    res.status(201).json({
      success: true,
      data: newTrack
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create track'
    });
  }
});

// PUT /api/tracks/:id - Update an existing track
app.put('/api/tracks/:id', async (req, res) => {
  try {
    const track = await Track.findByPk(req.params.id);
    
    if (!track) {
      return res.status(404).json({
        success: false,
        error: 'Track not found'
      });
    }
    
    const { songTitle, artistName, albumName, genre, duration, releaseYear } = req.body;
    
    // Update only provided fields
    await track.update({
      songTitle: songTitle || track.songTitle,
      artistName: artistName || track.artistName,
      albumName: albumName || track.albumName,
      genre: genre || track.genre,
      duration: duration || track.duration,
      releaseYear: releaseYear || track.releaseYear
    });
    
    res.json({
      success: true,
      data: track
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update track'
    });
  }
});

// DELETE /api/tracks/:id - Delete a track
app.delete('/api/tracks/:id', async (req, res) => {
  try {
    const track = await Track.findByPk(req.params.id);
    
    if (!track) {
      return res.status(404).json({
        success: false,
        error: 'Track not found'
      });
    }
    
    await track.destroy();
    
    res.json({
      success: true,
      message: 'Track deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete track'
    });
  }
});

// 404 handler for unmatched routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API endpoints:`);
  console.log(`   GET    /api/tracks`);
  console.log(`   GET    /api/tracks/:id`);
  console.log(`   POST   /api/tracks`);
  console.log(`   PUT    /api/tracks/:id`);
  console.log(`   DELETE /api/tracks/:id`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔒 Closing database connection...');
  await sequelize.close();
  process.exit(0);
});