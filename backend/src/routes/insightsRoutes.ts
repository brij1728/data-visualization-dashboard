import express, { Request, Response } from 'express';

import { InsightModel } from 'db';

const router = express.Router();

// Get all Insights
router.get('/', async (req: Request, res: Response) => {
  try {
    const insights = await InsightModel.find();
    res.json(insights);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get a single Insight by id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const insight = await InsightModel.findById(req.params.id);
    if (!insight) {
      return res.status(404).send('Insight not found');
    }
    res.json(insight);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get all Insights by sector
router.get('/sector/:sector', async (req, res) => {
  try {
    const insights = await InsightModel.find({ sector: req.params.sector });
    res.json(insights);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get all insights by year range
router.get('/year-range', async (req, res) => {
  const { startYear, endYear } = req.query;
  try {
    const insights = await InsightModel.find({
      start_year: { $gte: startYear },
      end_year: { $lte: endYear }
    });
    res.json(insights);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get all insights with high relevance
router.get('/high-relevance', async (req, res) => {
  const relevanceThreshold = req.query.relevance || 7; // Default threshold
  try {
    const insights = await InsightModel.find({
      relevance: { $gt: relevanceThreshold }
    });
    res.json(insights);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get insights by keyword search
router.get('/search', async (req, res) => {
    const keyword = typeof req.query.keyword === 'string' ? req.query.keyword : '';
  try {
    const insights = await InsightModel.find({
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { insight: { $regex: keyword, $options: 'i' } },
        { topic: { $regex: keyword, $options: 'i' } }
      ]
    });
    res.json(insights);
  } catch (error) {
    res.status(500).send(error.message);
  }
});


// Get the most recent insights
router.get('/recent', async (req, res) => {
  const limit = parseInt(req.query.limit as string, 10) || 10;
  try {
    const insights = await InsightModel.find().sort({ added: -1 }).limit(limit);
    res.json(insights);
  } catch (error) {
    res.status(500).send(error.message);
  }
});



// Create a new Insight
router.post('/', async (req: Request, res: Response) => {
  try {
    const newInsight = new InsightModel(req.body);
    await newInsight.save();
    res.status(201).json(newInsight);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update an Insight
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const updatedInsight = await InsightModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedInsight) {
      return res.status(404).send('Insight not found');
    }
    res.json(updatedInsight);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Delete an Insight
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const deletedInsight = await InsightModel.findByIdAndDelete(req.params.id);
    if (!deletedInsight) {
      return res.status(404).send('Insight not found');
    }
    res.status(204).send(); // No content to send back
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default router;
