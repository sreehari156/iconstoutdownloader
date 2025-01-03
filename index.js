const express = require('express');
const { chromium } = require('playwright');  // Import Playwright

const app = express();
app.use(express.json()); // Middleware to parse JSON body

// POST API to extract ID from the second URL
app.post('/', async (req, res) => {
  const { website_url } = req.body; // Extract website_url from the request body

  if (!website_url) {
    return res.status(400).json({ error: 'Website URL is required' });
  }

  let browser; // Declare browser variable outside the try block

  try {
    // Log the environment variable for debugging
    console.log('Chromium executable path:', process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH);

    // Launch browser
    browser = await chromium.launch({
      headless: true,
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, // Fallback to default if not set
    });
    const page = await browser.newPage();

    // Navigate to the provided website URL
    await page.goto(website_url);

    // Wait for the page to load
    await page.waitForSelector('body');

    // Execute JavaScript to get the window.__NUXT__ content
    const nuxtContent = await page.evaluate(() => window.__NUXT__);

    // Convert the object to a string
    const nuxtContentStr = JSON.stringify(nuxtContent);

    // Use regex to find all URLs starting with the specified prefixes
    const regex = /https:\/\/(?:cdn|cdn3d|cdnl|cdni)\.iconscout\.com\/[^\s"\']+/g;
    const matches = nuxtContentStr.match(regex);

    // Ensure there are at least two matching URLs
    if (matches && matches.length >= 2) {
      // Get the second URL
      const secondUrl = matches[1];

      // Extract the numeric ID before the file extension
      const idMatch = secondUrl.match(/(\d+)(?=\.\w+$)/);
      if (idMatch) {
        // Return the extracted ID in the response
        return res.json({ id: idMatch[1] });
      } else {
        return res.status(404).json({ error: 'Not found' });
      }
    } else {
      return res.status(404).json({ error: 'Not found.' });
    }
  } catch (error) {
    console.error('Error extracting ID:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    // Ensure the browser is only closed if it was successfully launched
    if (browser) {
      await browser.close();
    }
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
