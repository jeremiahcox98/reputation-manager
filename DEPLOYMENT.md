# Deployment Guide - GitHub Actions

This guide will help you deploy the reputation manager to GitHub and set it up to run daily.

## Step 1: Create Initial Git Commit

```bash
# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Daily metrics collection script"
```

## Step 2: Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right → "New repository"
3. Name it (e.g., `reputation-manager`)
4. Choose **Private** (recommended to keep API keys secure)
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

## Step 3: Connect Local Repository to GitHub

GitHub will show you commands. Use these (replace `YOUR_USERNAME` and `REPO_NAME`):

```bash
# Add remote (replace with your actual repo URL)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 4: Set Up GitHub Secrets

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** for each of the following:

### Required Secrets:

- `HASDATA_API_KEY` - Your HasData API key
- `GOOGLE_PLACE_ID` - Your Google Maps Place ID (e.g., `ChIJG4Y1j71_20cRopSDvPfX8lw`)
- `INSTAGRAM_BUSINESS_HANDLE` - Business Instagram handle (e.g., `dr.jeremiahcox`)
- `INSTAGRAM_PERSONAL_HANDLE` - Personal Instagram handle (e.g., `jeremiah_cox_`)
- `GOHIGHLEVEL_API_TOKEN` - Your GoHighLevel PIT token
- `GOHIGHLEVEL_LOCATION_ID` - Your GoHighLevel location ID
- `NOTION_API_KEY` - Your Notion API key
- `NOTION_DATABASE_ID` - Your Notion database ID

### Optional Secrets (if using OAuth instead of PIT):

- `GOHIGHLEVEL_CLIENT_ID` - GoHighLevel OAuth client ID
- `GOHIGHLEVEL_CLIENT_SECRET` - GoHighLevel OAuth client secret

## Step 5: Verify Workflow

1. Go to the **Actions** tab in your GitHub repository
2. You should see "Daily Metrics Collection" workflow
3. You can manually trigger it by:
   - Going to **Actions** tab
   - Clicking "Daily Metrics Collection" in the left sidebar
   - Clicking "Run workflow" → "Run workflow"

## Step 6: Schedule

The workflow is configured to run **daily at 9:00 AM UTC**. 

To change the schedule, edit `.github/workflows/daily-metrics.yml` and modify the cron expression:
- Current: `'0 9 * * *'` (9 AM UTC daily)
- Format: `'minute hour day month day-of-week'`
- Example: `'0 14 * * *'` = 2 PM UTC daily

## Troubleshooting

### Workflow Not Running
- Check that the workflow file is in `.github/workflows/` directory
- Verify the cron syntax is correct
- Check the Actions tab for any error messages

### Secrets Not Working
- Ensure all secrets are set correctly (case-sensitive)
- Check that secret names match exactly what's in the workflow file
- Verify API keys are still valid

### Date Issues
- The script uses local timezone for dates
- GitHub Actions runs in UTC, but the script converts to local date
- If you need a specific timezone, you can modify the date formatting in `src/notion.js`

## Monitoring

- Check the **Actions** tab to see workflow runs
- Each run will show logs of what was collected
- Failed runs will show error messages

## Notes

- The workflow runs on GitHub's free tier (2,000 minutes/month for private repos)
- Each run takes about 10-30 seconds, so you have plenty of free minutes
- Public repositories get unlimited free minutes

