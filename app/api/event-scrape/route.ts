import { NextRequest, NextResponse } from 'next/server';
import { chromium } from 'playwright';
import OpenAI from 'openai';
import { getCategories } from '@/lib/config';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface EventData {
  eventName: string;
  date: string; // ISO date format (YYYY-MM-DD)
  startTime: string; // Start time format (HH:MM AM/PM)
  endTime: string; // End time format (HH:MM AM/PM) 
  location: string;
  ticketCost: number; // Price in dollars, 0 for free
  description: string;
  numberOfPeopleGoing: number; // Numeric count
  category: string | string[]; // Can be one category string or array of category strings
  platform: 'partiful' | 'posh' | 'unknown';
}

export async function POST(request: NextRequest) {
  try {
    console.log('Received event scrape request');
    
    const { eventLink } = await request.json();
    console.log('Event link received:', eventLink);

    if (!eventLink) {
      console.log('No event link provided');
      return NextResponse.json(
        { error: 'Event link is required' },
        { status: 400 }
      );
    }

    // Note: OpenAI API key is optional - will use fallback if not configured
    if (!process.env.OPENAI_API_KEY) {
      console.warn('OpenAI API key not configured - will return raw scraped content');
    }

    // Validate URL format
    let url;
    try {
      url = new URL(eventLink);
    } catch (urlError) {
      console.error('Invalid URL format:', urlError);
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    const platform = getPlatform(url.hostname);
    console.log(`Detected platform: ${platform} for hostname: ${url.hostname}`);

    console.log(`Starting to scrape event from ${platform}: ${eventLink}`);

    // Launch Playwright browser
    let browser;
    try {
      browser = await chromium.launch({ 
        headless: true,
        args: [
          '--no-sandbox', 
          '--disable-setuid-sandbox', 
          '--disable-dev-shm-usage',
          '--disable-blink-features=AutomationControlled',
          '--disable-features=VizDisplayCompositor'
        ]
      });
      console.log('Browser launched successfully');
    } catch (browserError) {
      console.error('Failed to launch browser:', browserError);
      return NextResponse.json(
        { error: 'Failed to launch browser', details: browserError instanceof Error ? browserError.message : 'Unknown browser error' },
        { status: 500 }
      );
    }
    
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 720 },
      extraHTTPHeaders: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      }
    });
    
    const page = await context.newPage();
    
    // Add stealth measures
    await page.addInitScript(() => {
      // Remove webdriver property
      delete (window as any).navigator.webdriver;
      
      // Override the plugins length
      Object.defineProperty(navigator, 'plugins', {
        get: () => [1, 2, 3, 4, 5]
      });
    });

    try {
      console.log('Navigating to page...');
      
      // Try multiple loading strategies
      let pageText = '';
      let loadSuccess = false;

      // Strategy 1: Try with domcontentloaded (faster)
      try {
        await page.goto(eventLink, { 
          waitUntil: 'domcontentloaded',
          timeout: 15000 
        });
        await page.waitForTimeout(2000); // Wait for dynamic content
        pageText = await page.evaluate(() => document.body.innerText);
        if (pageText.length > 100) { // Check if we got meaningful content
          loadSuccess = true;
          console.log('Page loaded successfully with domcontentloaded');
        }
      } catch (fastLoadError) {
        const errorMessage = fastLoadError instanceof Error ? fastLoadError.message : 'Unknown error';
        console.log('Fast load failed, trying slower approach:', errorMessage);
      }

      // Strategy 2: If fast load failed, try with load event
      if (!loadSuccess) {
        try {
          await page.goto(eventLink, { 
            waitUntil: 'load',
            timeout: 20000 
          });
          await page.waitForTimeout(3000);
          pageText = await page.evaluate(() => document.body.innerText);
          if (pageText.length > 100) {
            loadSuccess = true;
            console.log('Page loaded successfully with load event');
          }
        } catch (normalLoadError) {
          const errorMessage = normalLoadError instanceof Error ? normalLoadError.message : 'Unknown error';
          console.log('Normal load failed, trying minimal approach:', errorMessage);
        }
      }

      // Strategy 3: Last resort - minimal loading
      if (!loadSuccess) {
        try {
          await page.goto(eventLink, { 
            waitUntil: 'commit',
            timeout: 10000 
          });
          await page.waitForTimeout(5000); // Give more time for content to load
          pageText = await page.evaluate(() => document.body.innerText);
          loadSuccess = true;
          console.log('Page loaded with minimal strategy');
        } catch (minimalLoadError) {
          const errorMessage = minimalLoadError instanceof Error ? minimalLoadError.message : 'Unknown error';
          console.error('All loading strategies failed:', errorMessage);
          throw new Error(`Failed to load page after multiple attempts: ${errorMessage}`);
        }
      }

      console.log('Successfully scraped page content, length:', pageText.length);
      console.log('First 500 chars of content:', pageText.slice(0, 500));

      // Check if we got meaningful content
      if (pageText.length < 50) {
        console.warn('Very little content extracted, might be blocked or redirected');
      }

      // Close browser
      await browser.close();

      // Process with OpenAI
      console.log('Processing with OpenAI...');
      const eventData = await processWithOpenAI(pageText, platform);
      
      console.log('Extracted event data:', JSON.stringify(eventData, null, 2));

      return NextResponse.json({
        success: true,
        data: eventData,
        platform,
        contentLength: pageText.length
      });

    } catch (scrapeError) {
      console.error('Scraping error:', scrapeError);
      await browser.close();
      throw scrapeError;
    }

  } catch (error) {
    console.error('Error scraping event:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to scrape event data',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

function getPlatform(hostname: string): 'partiful' | 'posh' | 'unknown' {
  if (hostname.includes('partiful')) return 'partiful';
  if (hostname.includes('posh')) return 'posh';
  return 'unknown';
}

async function processWithOpenAI(pageText: string, platform: string): Promise<EventData> {
  const availableCategories = getCategories();
  
  // For development/testing: If no OpenAI key, return mock data with raw text
  if (!process.env.OPENAI_API_KEY) {
    console.log('No OpenAI key - returning mock data with raw content');
    return {
      eventName: 'Mock Event (OpenAI not configured)',
      date: '2024-01-01',
      startTime: 'Start time extraction requires OpenAI',
      endTime: 'End time extraction requires OpenAI',
      location: 'Location extraction requires OpenAI',
      ticketCost: 0,
      description: `Raw scraped content (first 500 chars): ${pageText.slice(0, 500)}`,
      numberOfPeopleGoing: 0,
      category: availableCategories[0] || 'Entertainment',
      platform: platform as 'partiful' | 'posh' | 'unknown'
    };
  }

  const prompt = `
You are an expert at extracting event information from website content. 
Extract the following information from this ${platform} event page content and return it as a JSON object:

Required fields with specific formats:
- eventName: The name/title of the event (string)
- date: Event date in YYYY-MM-DD format (string, e.g. "2024-07-17")
- startTime: Event start time in HH:MM AM/PM format (string, e.g. "7:00 PM")
- endTime: Event end time in HH:MM AM/PM format (string, e.g. "8:30 PM", use "Not specified" if no end time given)
- location: Where the event is taking place (string, use "Not specified" if hidden/unknown)
- ticketCost: Price as a number in dollars (number, use 0 for free events, extract just the numeric value from "$10" -> 10)
- description: Brief description of the event (string)
- numberOfPeopleGoing: Number of people attending/interested as a number (number, extract from RSVP count, use 0 if unknown)
- category: Must be one or more categories from this EXACT list: ${availableCategories.join(', ')}. 
  Can be a single string (e.g. "Technology") or an array of strings (e.g. ["Technology", "Entertainment"]) if multiple categories apply.
  ONLY use categories from the provided list, do not create new categories.

Available categories to choose from: ${availableCategories.join(', ')}

Website content:
${pageText.slice(0, 4000)}

IMPORTANT: 
- Return ONLY a raw JSON object, no markdown code blocks
- Ensure ticketCost and numberOfPeopleGoing are numbers, not strings
- Use proper date format (YYYY-MM-DD) for the date field
- If you can't determine the year, use 2024
- For category, ONLY use the exact category names from the provided list
- If multiple categories apply, use an array; if only one applies, use a string
`;

  try {
    console.log('Calling OpenAI API...');
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a precise data extraction assistant. Always return valid JSON with the exact field names requested."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 1000
    });

    const response = completion.choices[0]?.message?.content;
    console.log('OpenAI response received:', response);
    
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    // Try to parse the JSON response
    try {
      // Clean up the response - remove markdown code blocks if present
      let cleanResponse = response.trim();
      
      // Remove ```json and ``` wrappers if present
      if (cleanResponse.startsWith('```json')) {
        cleanResponse = cleanResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanResponse.startsWith('```')) {
        cleanResponse = cleanResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      console.log('Cleaned response for parsing:', cleanResponse);
      
      const eventData = JSON.parse(cleanResponse);
      
      // Validate required fields exist
      const requiredFields = ['eventName', 'date', 'startTime', 'endTime', 'location', 'ticketCost', 'description', 'numberOfPeopleGoing', 'category'];
      const missingFields = requiredFields.filter(field => !(field in eventData));
      
      if (missingFields.length > 0) {
        console.warn(`Missing required fields: ${missingFields.join(', ')}`);
        // Fill in missing fields
        missingFields.forEach(field => {
          if (field === 'ticketCost' || field === 'numberOfPeopleGoing') {
            eventData[field] = 0;
          } else if (field === 'date') {
            eventData[field] = '2024-01-01';
          } else if (field === 'category') {
            eventData[field] = availableCategories[0] || 'Entertainment';
          } else {
            eventData[field] = 'Not specified';
          }
        });
      }

      // Validate category field contains only valid categories
      if (eventData.category) {
        const categoryArray = Array.isArray(eventData.category) ? eventData.category : [eventData.category];
        const validCategories = categoryArray.filter((cat: string) => availableCategories.includes(cat));
        
        if (validCategories.length === 0) {
          // No valid categories found, use first available category
          console.warn(`No valid categories found in: ${JSON.stringify(eventData.category)}, using fallback`);
          eventData.category = availableCategories[0] || 'Entertainment';
        } else if (validCategories.length === 1) {
          // Single valid category, use as string
          eventData.category = validCategories[0];
        } else {
          // Multiple valid categories, keep as array
          eventData.category = validCategories;
        }
      }

      // Post-process to ensure correct data types
      const processedData = {
        ...eventData,
        ticketCost: typeof eventData.ticketCost === 'number' ? eventData.ticketCost : 
                   (typeof eventData.ticketCost === 'string' ? parseFloat(eventData.ticketCost.replace(/[^0-9.]/g, '')) || 0 : 0),
        numberOfPeopleGoing: typeof eventData.numberOfPeopleGoing === 'number' ? eventData.numberOfPeopleGoing :
                           (typeof eventData.numberOfPeopleGoing === 'string' ? parseInt(eventData.numberOfPeopleGoing.replace(/[^0-9]/g, '')) || 0 : 0),
        platform
      };

      console.log('Processed event data with correct types:', processedData);
      
      return processedData;
      
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', response);
      console.error('Parse error:', parseError);
      throw new Error('Invalid JSON response from OpenAI');
    }

  } catch (openaiError) {
    console.error('OpenAI processing error:', openaiError);
    
    // Return fallback data structure with error info
    return {
      eventName: 'Could not extract event name',
      date: '2024-01-01',
      startTime: 'Could not extract start time',
      endTime: 'Could not extract end time',
      location: 'Could not extract location',
      ticketCost: 0,
      description: `OpenAI processing failed. Error: ${openaiError instanceof Error ? openaiError.message : 'Unknown error'}. Raw content: ${pageText.slice(0, 200)}...`,
      numberOfPeopleGoing: 0,
      category: availableCategories[0] || 'Entertainment',
      platform: platform as 'partiful' | 'posh' | 'unknown'
    };
  }
}
