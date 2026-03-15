// server.js
const express = require('express');
const { sequelize, Track } = require('./database/setup.js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Test database connection
sequelize.authenticate()
  .then(() => console.log('✅ Database connected'))
  .catch(err => console.error('❌ Database connection error:', err));

// ========== API ENDPOINTS ==========
// GET all tracks
app.get('/api/tracks', async (req, res) => {
  try {
    const tracks = await Track.findAll();
    res.json({ success: true, count: tracks.length, data: tracks });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch tracks' });
  }
});

// GET single track - NOTE THE :id FORMAT
app.get('/api/tracks/:id', async (req, res) => {
  try {
    const track = await Track.findByPk(req.params.id);
    if (!track) return res.status(404).json({ success: false, error: 'Track not found' });
    res.json({ success: true, data: track });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch track' });
  }
});

// POST new track
app.post('/api/tracks', async (req, res) => {
  try {
    const { songTitle, artistName, albumName, genre, duration, releaseYear } = req.body;
    
    // Validation
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
    
    const newTrack = await Track.create(req.body);
    res.status(201).json({ success: true, data: newTrack });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create track' });
  }
});

// PUT update track - NOTE THE :id FORMAT
app.put('/api/tracks/:id', async (req, res) => {
  try {
    const track = await Track.findByPk(req.params.id);
    if (!track) return res.status(404).json({ success: false, error: 'Track not found' });
    
    await track.update(req.body);
    res.json({ success: true, data: track });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update track' });
  }
});

// DELETE track - NOTE THE :id FORMAT
app.delete('/api/tracks/:id', async (req, res) => {
  try {
    const track = await Track.findByPk(req.params.id);
    if (!track) return res.status(404).json({ success: false, error: 'Track not found' });
    
    await track.destroy();
    res.json({ success: true, message: 'Track deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete track' });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});