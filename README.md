# Business Opportunity Scanner

A web application that scans news from local, national, and international sources to identify emerging business opportunities.

## Features

- 📰 **Multi-Source News Scanning**: Fetch news from local, national, and international sources
- 💼 **Business Opportunity Detection**: Automatically analyzes news articles for business opportunities using keyword matching and pattern recognition
- 🎯 **Smart Categorization**: Identifies opportunities by type (Tech Market, Investment, Regulatory, Consumer Trends, etc.)
- 📊 **Scoring System**: Ranks opportunities by relevance and potential
- 🎨 **Modern UI**: Clean, responsive design with intuitive controls

## Setup

### 1. Get a NewsAPI Key

This app uses [NewsAPI](https://newsapi.org/) to fetch news articles. You'll need a free API key:

1. Visit [newsapi.org/register](https://newsapi.org/register)
2. Sign up for a free account
3. Copy your API key

**Note**: The free tier has some limitations:
- Local news may be limited (uses general business news)
- International news uses the "everything" endpoint which may have rate limits
- For production use, consider upgrading to a paid plan

### 2. Run the Application

Start a local server:

```bash
npm start
```

Or use npx directly:

```bash
npx serve . -l 5000
```

Then open your browser to `http://localhost:5000`

### 3. Configure the API Key

1. When you first open the app, you'll see a setup section
2. Enter your NewsAPI key in the input field
3. Click "Save API Key" - it will be stored in your browser's localStorage

## How It Works

### News Scanning

- **Local**: Scans local/community news (note: NewsAPI free tier limitations may apply)
- **National**: Fetches national business news from your country (default: US)
- **International**: Scans global news sources for international opportunities

### Opportunity Detection

The app analyzes articles for business opportunity indicators across multiple categories:

- **Market Trends**: Growth, demand, emerging markets
- **Investment**: Funding, startups, acquisitions
- **Technology**: Innovation, breakthroughs, digital transformation
- **Regulation**: Policy changes, compliance requirements
- **Market Gaps**: Shortages, unmet needs
- **Consumer Behavior**: Shifting preferences, lifestyle changes
- **Emerging Sectors**: New industries, disruptions

Articles are scored based on:
- Number of opportunity indicators found
- Relevance to business/entrepreneurship
- Action-oriented language

### Using the App

1. **Select News Scopes**: Choose which news sources to scan (Local, National, International)
2. **Click "Scan News"**: The app will fetch recent articles and analyze them
3. **Review Opportunities**: Business opportunities are displayed at the top with:
   - Opportunity type
   - Relevance score
   - Key categories detected
   - Source and scope information
4. **Read Articles**: Click "Read full article" to view the complete news story

## Technical Details

- **Pure JavaScript**: No frameworks required, vanilla JS implementation
- **NewsAPI Integration**: Uses NewsAPI v2 endpoints
- **Local Storage**: API key is stored in browser localStorage
- **Responsive Design**: Works on desktop and mobile devices

## Limitations

- **API Rate Limits**: NewsAPI free tier has rate limits
- **CORS**: May require a proxy server for production deployment (NewsAPI has CORS restrictions)
- **Analysis**: Currently uses keyword-based detection; more sophisticated AI analysis could be added

## Future Enhancements

- Integration with AI/ML models for deeper analysis
- Custom opportunity categories
- Email alerts for high-scoring opportunities
- Historical trend analysis
- Export functionality for opportunities

## License

MIT
