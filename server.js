const express = require('express');
const { sequelize, Track } = require('./database/setup.js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());


// GET all tracks
app.get('/api/tracks', async (req, res) => {
  try {
    const tracks = await Track.findAll();
    res.json({ 
      success: true, 
      count: tracks.length, 
      data: tracks 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// GET one track - NOTE: '/api/tracks/:id' (colon RIGHT NEXT TO id, NO SPACES)
app.get('/api/tracks/:id', async (req, res) => {
  try {
    const track = await Track.findByPk(req.params.id);
    if (!track) {
      return res.status(404).json({ 
        success: false, 
        error: 'Track not found' 
      });
    }
    res.json({ success: true, data: track });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// POST new track
app.post('/api/tracks', async (req, res) => {
  try {
    const { songTitle, artistName, albumName, genre, duration, releaseYear } = req.body;
    
    // Check required fields
    if (!songTitle || !artistName || !albumName || !genre || !duration || !releaseYear) {
      return res.status(400).json({ 
        success: false, 
        error: 'All fields are required' 
      });
    }
    
    const newTrack = await Track.create(req.body);
    res.status(201).json({ success: true, data: newTrack });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// PUT update track - NOTE: SAME FORMAT '/api/tracks/:id'
app.put('/api/tracks/:id', async (req, res) => {
  try {
    const track = await Track.findByPk(req.params.id);
    if (!track) {
      return res.status(404).json({ 
        success: false, 
        error: 'Track not found' 
      });
    }
    
    await track.update(req.body);
    res.json({ success: true, data: track });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// DELETE track - NOTE: SAME FORMAT '/api/tracks/:id'
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
      error: error.message 
    });
  }
});

// Start server with database connection
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log('📚 Available endpoints:');
    console.log('   GET    /api/tracks');
    console.log('   GET    /api/tracks/:id');
    console.log('   POST   /api/tracks');
    console.log('   PUT    /api/tracks/:id');
    console.log('   DELETE /api/tracks/:id');
  });
}).catch(err => {
  console.error('❌ Database sync failed:', err);
});