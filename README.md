# Reputation Manager - Daily Metrics Collection

Automatically collects reputation and social media metrics daily and stores them in a Notion database. Runs on GitHub Actions via scheduled cron jobs.

## Features

- 📊 **Google Reviews**: Collects review count and average rating
- 📱 **Instagram Followers**: Tracks follower counts for business and personal accounts
- 📧 **Newsletter Subscribers**: Monitors GoHighLevel newsletter subscriber count
- 🗄️ **Notion Database**: Stores all metrics in a structured Notion database
- ⏰ **Automated**: Runs daily via GitHub Actions cron job

## Setup

### 1. Prerequisites

- Node.js 20 or higher
- A Notion account with API access
- HasData API key
- GoHighLevel API credentials (optional)

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required environment variables:
- `HASDATA_API_KEY` - Your HasData API key
- `GOOGLE_PLACE_ID` - Google Maps Place ID for your business
- `INSTAGRAM_BUSINESS_HANDLE` - Business Instagram handle (without @)
- `INSTAGRAM_PERSONAL_HANDLE` - Personal Instagram handle (without @)
- `NOTION_API_KEY` - Notion integration API key
- `NOTION_DATABASE_ID` - Notion database ID

Optional:
- `GOHIGHLEVEL_API_TOKEN` - GoHighLevel API token
- `GOHIGHLEVEL_LOCATION_ID` - GoHighLevel location ID

### 4. Set Up Notion Database

Create a Notion database with the following properties:

- **Day** (Title) - Primary identifier, contains date in text format (e.g., "December 20, 2024")
- **Google Reviews Count** (Number)
- **Google Review Rating** (Number)
- **Instagram Followers Business** (Number)
- **Instagram Followers Personal** (Number)
- **Newsletter Subscribers** (Number)

To get your Notion database ID:
1. Open your Notion database in a browser
2. The URL will look like: `https://www.notion.so/workspace/DATABASE_ID?v=...`
3. Copy the `DATABASE_ID` (32 characters, alphanumeric)

### 5. Set Up Notion Integration

1. Go to https://www.notion.so/my-integrations
2. Click "New integration"
3. Give it a name and select your workspace
4. Copy the "Internal Integration Token" (this is your `NOTION_API_KEY`)
5. Share your database with the integration:
   - Open your database
   - Click the "..." menu in the top right
   - Click "Add connections"
   - Select your integration

### 6. GitHub Actions Setup

1. Push your code to a GitHub repository
2. Go to your repository Settings → Secrets and variables → Actions
3. Add the following secrets:
   - `HASDATA_API_KEY`
   - `GOOGLE_PLACE_ID`
   - `INSTAGRAM_BUSINESS_HANDLE`
   - `INSTAGRAM_PERSONAL_HANDLE`
   - `NOTION_API_KEY`
   - `NOTION_DATABASE_ID`
   - `GOHIGHLEVEL_API_TOKEN` (optional)
   - `GOHIGHLEVEL_LOCATION_ID` (optional)

## Usage

### Run Locally

```bash
npm start
```

### Run via GitHub Actions

The workflow runs automatically daily at 9:00 AM UTC. You can also trigger it manually:

1. Go to the "Actions" tab in your GitHub repository
2. Select "Daily Metrics Collection"
3. Click "Run workflow"

## Project Structure

```
.
├── index.js                          # Main orchestration script
├── src/
│   ├── config.js                    # Configuration management
│   ├── notion.js                     # Notion API integration
│   └── collectors/
│       ├── googleReviews.js         # Google Reviews collector
│       ├── instagram.js              # Instagram followers collector
│       └── gohighlevel.js            # Newsletter subscribers collector
├── .github/
│   └── workflows/
│       └── daily-metrics.yml        # GitHub Actions workflow
├── .env.example                      # Environment variables template
├── .gitignore                        # Git ignore file
├── package.json                      # Dependencies and scripts
└── README.md                         # This file
```

## API Details

### HasData API

- **Google Reviews**: `https://api.hasdata.com/scrape/google-maps/reviews`
  - Requires: `placeId` parameter
  - Returns: `placeInfo.reviews` and `placeInfo.rating`

- **Instagram Profile**: `https://api.hasdata.com/scrape/instagram/profile`
  - Requires: `handle` parameter
  - Returns: `followersCount`

### Notion API

- Uses `@notionhq/client` for database operations
- Implements upsert logic (updates existing row if date exists, creates new if not)

## Notes

- The script is idempotent (safe to run multiple times per day)
- Errors in individual collectors won't stop the entire script
- Missing GoHighLevel credentials will result in 0 subscribers (script continues)
- All timestamps are stored in UTC

## Troubleshooting

### Notion API Errors

- Ensure your integration has access to the database
- Verify the database ID is correct
- Check that all property names match exactly (case-sensitive)

### HasData API Errors

- Verify your API key is correct
- Check that the Place ID and Instagram handles are valid
- Review API rate limits if you're making many requests

### GitHub Actions Errors

- Verify all secrets are set correctly
- Check the Actions logs for detailed error messages
- Ensure the workflow file is in `.github/workflows/` directory

## License

ISC

