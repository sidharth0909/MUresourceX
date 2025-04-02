const express = require('express');
const router = express.Router();
const Ad = require('../models/ad');
const { v4: uuidv4 } = require('uuid');

// Post new advertisement


router.post('/', async (req, res) => {
  try {
    // 1. Destructure with default value
    const { imageUrl, link, duration = 7 } = req.body;

    // 2. Validate required fields
    if (!imageUrl || !link) {
      return res.status(400).json({
        success: false,
        message: 'Image URL and link are required'
      });
    }

    // 3. Ensure duration is a number
    const adDuration = Number(duration) || 7; // Fallback to 7 days if invalid

    // 4. Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + adDuration);

    // 5. Create new ad
    const newAd = new Ad({
      adId: uuidv4(), // Generate a unique ID for the ad
      imageUrl,
      link,
      duration: adDuration,
      stats: { impressions: 0, clicks: 0 },
      expiresAt
    });

    await newAd.save();
    
    return res.status(201).json({  // Explicit status code
      success: true,
      message: 'Ad created successfully',
      ad: newAd
    });
    
  } catch (error) {
    console.error('Error creating ad:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// Get current active ad
router.get('/current', async (req, res) => {
  try {
    const ad = await Ad.findOne({
      expiresAt: { $gt: new Date() }
    }).sort({ createdAt: -1 });

    if (!ad) {
      return res.json({ success: false, message: 'No active ads' });
    }

    // Increment impressions
    ad.stats.impressions += 1;
    await ad.save();

    res.json({ success: true, ad });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Record ad click
router.get('/click/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ID exists
    if (!id || id === 'undefined') {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing ad ID' 
      });
    }

    // Find and update the ad
    const ad = await Ad.findOneAndUpdate(
      { 
        $or: [
          { _id: id },          // Try as ObjectId
          { adId: id }          // Try as custom ID
        ] 
      },
      { $inc: { 'stats.clicks': 1 } },
      { new: true }
    );

    if (!ad) {
      return res.status(404).json({ 
        success: false, 
        message: 'Ad not found' 
      });
    }

    // Redirect to the actual ad link
    return res.redirect(ad.link);
    
  } catch (error) {
    console.error('Click tracking error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message // Include for debugging
    });
  }
});

// Get analytics
router.get('/analytics', async (req, res) => {
  try {
    const ads = await Ad.find().sort({ createdAt: -1 }).limit(30);
    
    const stats = {
      impressions: ads.reduce((sum, ad) => sum + ad.stats.impressions, 0),
      clicks: ads.reduce((sum, ad) => sum + ad.stats.clicks, 0),
      ctr: 0,
    };
    
    stats.ctr = stats.impressions > 0 
      ? ((stats.clicks / stats.impressions) * 100).toFixed(2)
      : 0;

    const chartData = {
      labels: ads.map(ad => new Date(ad.createdAt).toLocaleDateString()),
      impressions: ads.map(ad => ad.stats.impressions),
      clicks: ads.map(ad => ad.stats.clicks),
    };

    res.json({ success: true, stats, chartData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;