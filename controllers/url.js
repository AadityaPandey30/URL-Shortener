const URL = require('../models/url');
const shortid = require('shortid');

async function handleGenerateNewShortURL(req, res) {
  const body = req.body;
  if (!body.url) return res.status(400).json({ error: "URL is required" });

  const shortId = shortid.generate();

  try {
    const newURL = await URL.create({
      shortId: shortId,
      redirectURL: body.url,
      visitHistory: []
    });

    return res.json({ id: shortId });
  } catch (err) {
    console.error('Error creating new URL:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function handleGetAnalytics(req, res){
    const shortId = req.params.shortId;
    const result = await URL.findOne({shortId});
    return res.json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory,
    })
}

module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
};
