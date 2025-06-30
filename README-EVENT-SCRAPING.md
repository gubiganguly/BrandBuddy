# Event Scraping Setup

## Overview
The Find Sponsor button now scrapes event data from Partiful and Posh links using Playwright and optionally processes it with OpenAI for structured data extraction.

## Quick Test (No Setup Required)
1. Paste any Partiful or Posh event link in the search box on the homepage
2. Click "Find Sponsor" 
3. Check the browser console for the scraped data
4. Without OpenAI configured, you'll see raw scraped content

## Full Setup with OpenAI (Recommended)

### 1. Get OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create an account or sign in
3. Create a new API key
4. Copy the key (starts with `sk-`)

### 2. Add to Environment Variables
Create a `.env.local` file in the project root and add:
```
OPENAI_API_KEY=sk-your-actual-api-key-here
```

### 3. Restart Development Server
```bash
npm run dev
```

## What Gets Extracted
- **Event Name**: Title of the event
- **Date/Time**: When the event occurs
- **Location**: Venue or address
- **Ticket Cost**: Price or "Free"
- **Description**: Event details
- **Number of People Going**: RSVP count
- **Category**: Type of event (party, networking, etc.)

## Supported Platforms
- ✅ Partiful (partiful.com)
- ✅ Posh (posh.vip)
- ⚠️ Other platforms detected as "unknown"

## Troubleshooting

### "Failed to scrape event data"
1. Check the browser console for detailed error logs
2. Ensure the link is accessible and valid
3. Some events may be private or require login

### OpenAI Processing Fails
- The system will fallback to returning raw scraped content
- Check your API key is correct and has credits
- Verify the `.env.local` file is in the project root

## Example Output
```json
{
  "success": true,
  "data": {
    "eventName": "Tech Meetup Downtown",
    "dateTime": "December 15, 2024 at 7:00 PM",
    "location": "123 Main St, San Francisco, CA",
    "ticketCost": "Free",
    "description": "Join us for networking and tech talks",
    "numberOfPeopleGoing": "45 people going",
    "category": "networking",
    "platform": "partiful"
  },
  "platform": "partiful"
}
``` 