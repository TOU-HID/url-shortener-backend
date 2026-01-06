import type { Response } from 'express';
import type { AuthRequest } from '../middlewares/authMiddleware.js';
import Url from '../models/Url.js';
import User from '../models/User.js';
import { generateShortCode } from '../utils/generateShortCode.js';

const URL_LIMIT = 100;

// Need to work on this
export const createShortUrl = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { originalUrl } = req.body;
    const userId = req.user!._id;
    
    // Validation
    if (!originalUrl) {
      res.status(400).json({
        success: false,
        message: 'Please provide a URL to shorten'
      });
      return;
    }

    // Check URL limit
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    if (user.urlCount >= URL_LIMIT) {
      res.status(403).json({
        success: false,
        message: `URL limit reached (${URL_LIMIT}/${URL_LIMIT}). Please upgrade your account.`
      });
      return;
    }

    // Generate unique short code
    let shortCode: string;
    let isUnique = false;

    while (!isUnique) {
      shortCode = generateShortCode(6);
      const existingUrl = await Url.findOne({ shortCode });
      if (!existingUrl) {
        isUnique = true;
      }
    }

    // Create URL document
    const url = await Url.create({
      originalUrl,
      shortCode: shortCode!,
      userId
    });
    console.log('Touhid-hit-url', url);
    // Increment user's URL count
    user.urlCount += 1;
    console.log('Touhid-hit-user', user);
    await user.save();

    // Build short URL
    const baseUrl = process.env.BASE_URL;
    const shortUrl = `${baseUrl}/${url.shortCode}`;

    res.status(201).json({
      success: true,
      message: 'URL shortened successfully',
      data: {
        _id: url._id,
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        shortUrl,
        clicks: url.clicks,
        createdAt: url.createdAt
      }
    });
  } catch (error: any) {
    console.error('Create Short URL Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating shortened URL',
      error: error.message
    });
  }
};

export const getUserUrls = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!._id;

    const urls = await Url.find({ userId }).sort({ createdAt: -1 });

    // Build short URLs
    const baseUrl = process.env.BASE_URL;
    const urlsWithShortUrl = urls.map((url) => ({
      _id: url._id,
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      shortUrl: `${baseUrl}/${url.shortCode}`,
      clicks: url.clicks,
      createdAt: url.createdAt
    }));

    res.status(200).json({
      success: true,
      data: {
        urls: urlsWithShortUrl,
        totalCount: urls.length,
        limit: URL_LIMIT
      }
    });
  } catch (error: any) {
    console.error('Get User URLs Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching URLs',
      error: error.message
    });
  }
};

export const deleteUrl = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!._id;

    if (!id) {
       res.status(400).json({
        success: false,
        message: 'URL ID is required'
      });
      return;
    }

    // Find URL
    const url = await Url.findById(id);

    if (!url) {
      res.status(404).json({
        success: false,
        message: 'URL not found'
      });
      return;
    }

    // Check if URL belongs to user
    if (url.userId.toString() !== userId.toString()) {
      res.status(403).json({
        success: false,
        message: 'Not authorized to delete this URL'
      });
      return;
    }

    // Delete URL
    await Url.findByIdAndDelete(id);

    // Decrement user's URL count
    const user = await User.findById(userId);
    if (user && user.urlCount > 0) {
      user.urlCount -= 1;
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'URL deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete URL Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting URL',
      error: error.message
    });
  }
};

export const redirectToUrl = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { shortCode } = req.params;

    if (!shortCode) {
      res.status(400).json({
        success: false,
        message: 'Short code is required'
      });
      return;
    }

    // Find URL by short code
    const url = await Url.findOne({ shortCode });

    if (!url) {
      res.status(404).json({
        success: false,
        message: 'URL not found'
      });
      return;
    }

    // Increment click count
    url.clicks += 1;
    await url.save();

    // Redirect to original URL
    res.redirect(url.originalUrl);
  } catch (error: any) {
    console.error('Redirect Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error redirecting',
      error: error.message
    });
  }
};