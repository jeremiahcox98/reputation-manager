---
name: Daily Metrics Collection Script
overview: Build a Node.js script that automatically collects reputation and social media metrics daily and stores them in a Notion database, running on GitHub Actions via scheduled cron jobs.
todos:
  - id: project_setup
    content: Initialize Node.js project with package.json and project structure
    status: pending
  - id: notion_database
    content: "Set up Notion database with properties: Date, Google Reviews Count, Google Review Rating, Instagram Followers Business, Instagram Followers Personal, Newsletter Subscribers"
    status: pending
  - id: notion_integration
    content: Implement Notion API integration with upsert logic (update existing row if date exists, create new if not)
    status: pending
  - id: google_reviews_collector
    content: Build Google Reviews collector module to fetch review count and rating
    status: pending
  - id: instagram_collector
    content: Build Instagram collector module to fetch follower counts for business and personal accounts
    status: pending
  - id: gohighlevel_collector
    content: Build GoHighLevel collector module to fetch newsletter subscriber count
    status: pending
  - id: main_script
    content: Create main orchestration script that collects all metrics and stores in database
    status: pending
  - id: github_actions
    content: Set up GitHub Actions workflow with cron schedule for daily execution
    status: pending
  - id: documentation
    content: Create README, .env.example, and .gitignore with setup instructions
    status: pending
---

# Daily Metrics Collection Script

## Overview

Build a Node.js script that automatically collects reputation and social media metrics daily and stores them in a database. The script will run on **GitHub Actions** (free hosting) using scheduled cron jobs.

## Best Free Hosting Option: GitHub Actions

**GitHub Actions** is the best free option because:

- ✅ Completely free for public repositories
- ✅ 2,000 free minutes/month for private repos (sufficient for daily runs)
- ✅ Built-in cron scheduling (runs at specified times)
- ✅ No credit card required
- ✅ Reliable and widely used
- ✅ Easy to set up with workflow files

**Alternative free options** (if needed):

- **Render** - Free tier with cron jobs (limited hours)
- **Railway** - Free tier available
- **Vercel Cron Jobs** - Free tier

## Architecture

```
GitHub Actions (Daily Cron)
    ↓
Node.js Script
    ↓
Collect Metrics:
  - Google Reviews (HasData API)
  - Instagram Followers (2 accounts via HasData API)
  - GoHighLevel Newsletter Subscribers (API)
    ↓
Store in Database (Notion - One row per day with all metrics)
```

## Implementation Plan

### 1. Project Setup

- Initialize Node.js project with `package.json`
- Set up project structure with separate modules for each data source
- Create configuration file for API keys and credentials

### 2. Database Setup

- Use **Notion API** (free, easy viewing in Notion interface)
- Create a Notion database with properties (one row per day with all metrics):
    - `Date` (Date property) - Primary identifier for each day
    - `Google Reviews Count` (Number property) - Total number of Google reviews
    - `Google Review Rating` (Number property) - Average rating from Google reviews
    - `Instagram Followers Business` (Number property) - Business Instagram account follower count
    - `Instagram Followers Personal` (Number property) - Personal Instagram account follower count
    - `Newsletter Subscribers` (Number property) - GoHighLevel newsletter subscriber count
- Set up Notion API integration using `@notionhq/client`
- Implement upsert logic (update existing row if date exists, create new if not)

### 3. Data Collection Modules

#### Google Reviews Module

- Use **HasData API** (`https://api.hasdata.com/scrape/google-maps/reviews`)
- Requires `x-api-key` header and `placeId` query parameter
- Extract from response:
  - `placeInfo.reviews` - Total number of Google reviews
  - `placeInfo.rating` - Average rating from Google reviews
- Handle API response structure and error cases

#### Instagram Module

- Use **HasData API** (`https://api.hasdata.com/scrape/instagram/profile`)
- Requires `x-api-key` header and `handle` query parameter (e.g., `'dr.jeremiahcox'`)
- Extract from response:
  - `followersCount` - Follower count for the Instagram account
- Make separate API calls for business and personal Instagram accounts
- Handle API response structure and error cases

#### GoHighLevel Module

- Use GoHighLevel Node.js SDK (`@gohighlevel/api-client`)
- Authenticate using OAuth 2.0 or Private Integration Token
- Fetch newsletter subscriber count from API

### 4. Main Script

- Orchestrate all data collection modules
- Handle errors gracefully (log and continue)
- Insert collected data into database with timestamp
- Add logging for monitoring

### 5. GitHub Actions Workflow

- Create `.github/workflows/daily-metrics.yml`
- Configure cron schedule (e.g., daily at 9 AM UTC)
- Set up secrets for API keys and database credentials
- Install dependencies and run script

### 6. Configuration & Documentation

- Create `.env.example` template
- Add `README.md` with setup instructions
- Document required API keys and credentials
- Add `.gitignore` for sensitive files

## Files to Create

- `package.json` - Dependencies and scripts
- `index.js` - Main orchestration script
- `src/collectors/googleReviews.js` - Google Reviews collector using HasData API
- `src/collectors/instagram.js` - Instagram follower collector using HasData API
- `src/collectors/gohighlevel.js` - GoHighLevel subscriber collector
- `src/notion.js` - Notion API connection and database operations (upsert by date)
- `src/config.js` - Configuration management
- `.github/workflows/daily-metrics.yml` - GitHub Actions workflow
- `.env.example` - Environment variables template
- `README.md` - Setup and usage documentation
- `.gitignore` - Ignore sensitive files

## Required API Keys/Credentials

- HasData API key (`x-api-key` header) - For Google Reviews and Instagram followers
- Google Maps Place ID - For the business location (e.g., `ChIJG4Y1j71_20cRopSDvPfX8lw`)
- Instagram account handles (usernames without @) - For business and personal accounts (e.g., `dr.jeremiahcox`)
- GoHighLevel API credentials (OAuth or Private Integration Token)
- Notion API integration token and database ID

## Notes

- The script should be idempotent (safe to run multiple times)
- Add error handling and retry logic for API calls
- Store historical data for trend analysis
- Consider adding data validation before insertion
- HasData API returns `placeInfo.reviews` (count) and `placeInfo.rating` (average rating) for Google Reviews
- HasData API returns `followersCount` for Instagram profile data

