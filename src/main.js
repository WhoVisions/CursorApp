document.addEventListener('DOMContentLoaded', () => {
  const scanBtn = document.getElementById('scanBtn');
  const saveApiKeyBtn = document.getElementById('saveApiKey');
  const apiKeyInput = document.getElementById('apiKeyInput');
  const apiKeySection = document.getElementById('apiKeySection');
  const status = document.getElementById('status');
  const opportunitiesList = document.getElementById('opportunitiesList');
  const articlesList = document.getElementById('articlesList');
  const filterBtns = document.querySelectorAll('.filter-btn');

  let selectedScopes = ['local', 'national', 'international'];
  let newsApiKey = localStorage.getItem('newsApiKey');

  // Business opportunity keywords and patterns
  const opportunityIndicators = {
    market: ['market', 'demand', 'growth', 'expansion', 'emerging', 'trend', 'opportunity'],
    investment: ['investment', 'funding', 'startup', 'venture', 'capital', 'IPO', 'acquisition'],
    technology: ['innovation', 'breakthrough', 'technology', 'digital', 'AI', 'automation', 'platform'],
    regulation: ['regulation', 'policy', 'law', 'legislation', 'approval', 'compliance'],
    shortage: ['shortage', 'shortage', 'lack', 'need', 'gap', 'demand exceeds supply'],
    crisis: ['crisis', 'challenge', 'problem', 'issue', 'need solution'],
    newSector: ['new industry', 'emerging sector', 'disruption', 'transformation'],
    partnership: ['partnership', 'collaboration', 'alliance', 'joint venture'],
    consumer: ['consumer behavior', 'shifting preferences', 'new habits', 'lifestyle change']
  };

  // Initialize API key if saved
  if (newsApiKey) {
    apiKeyInput.value = newsApiKey;
    apiKeySection.style.display = 'none';
  }

  // Filter button handlers
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      const scope = btn.dataset.scope;
      if (btn.classList.contains('active')) {
        if (!selectedScopes.includes(scope)) {
          selectedScopes.push(scope);
        }
      } else {
        selectedScopes = selectedScopes.filter(s => s !== scope);
      }
    });
  });

  // Save API key
  saveApiKeyBtn.addEventListener('click', () => {
    const key = apiKeyInput.value.trim();
    if (key) {
      localStorage.setItem('newsApiKey', key);
      newsApiKey = key;
      apiKeySection.style.display = 'none';
      showStatus('API key saved!', 'success');
    } else {
      showStatus('Please enter a valid API key', 'error');
    }
  });

  // Scan news
  scanBtn.addEventListener('click', async () => {
    if (!newsApiKey) {
      showStatus('Please enter your NewsAPI key first', 'error');
      apiKeySection.style.display = 'block';
      return;
    }

    if (selectedScopes.length === 0) {
      showStatus('Please select at least one news scope', 'error');
      return;
    }

    scanBtn.disabled = true;
    scanBtn.querySelector('.btn-text').style.display = 'none';
    scanBtn.querySelector('.btn-loader').style.display = 'inline';

    opportunitiesList.innerHTML = '';
    articlesList.innerHTML = '';
    showStatus('Scanning news sources...', 'info');

    try {
      const allArticles = [];
      
      // Fetch news for each selected scope
      for (const scope of selectedScopes) {
        const articles = await fetchNews(scope);
        if (articles) {
          allArticles.push(...articles.map(article => ({ ...article, scope })));
        }
      }

      if (allArticles.length === 0) {
        showStatus('No news articles found. Try again later.', 'error');
        return;
      }

      // Analyze articles for business opportunities
      const opportunities = analyzeOpportunities(allArticles);

      // Display results
      displayOpportunities(opportunities);
      displayArticles(allArticles);

      showStatus(`Found ${opportunities.length} business opportunities from ${allArticles.length} articles`, 'success');

    } catch (error) {
      console.error('Error scanning news:', error);
      showStatus(`Error: ${error.message}`, 'error');
    } finally {
      scanBtn.disabled = false;
      scanBtn.querySelector('.btn-text').style.display = 'inline';
      scanBtn.querySelector('.btn-loader').style.display = 'none';
    }
  });

  async function fetchNews(scope) {
    let query = '';
    let country = 'us'; // Default country
    
    switch(scope) {
      case 'local':
        // For local news, use a general query - in production, you'd use geolocation
        query = 'local OR community OR city';
        break;
      case 'national':
        query = 'business OR economy OR politics';
        country = 'us';
        break;
      case 'international':
        query = 'global OR world OR international';
        country = null; // No country filter for international
        break;
    }

    try {
      // NewsAPI endpoint - using top headlines for demo
      let url = `https://newsapi.org/v2/top-headlines?apiKey=${newsApiKey}&pageSize=20`;
      
      if (scope === 'national') {
        url += `&country=${country}&category=business`;
      } else if (scope === 'local') {
        // For local, try to get general business news (NewsAPI free tier limitation)
        url += `&country=${country}&category=business`;
      } else {
        // International - use everything endpoint (requires paid tier) or search
        // For free tier, we'll use general business news
        url = `https://newsapi.org/v2/everything?apiKey=${newsApiKey}&q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=20&language=en`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'ok' && data.articles) {
        return data.articles.filter(article => article.title && article.description);
      } else if (data.status === 'error') {
        throw new Error(data.message || 'NewsAPI error');
      }
      
      return [];
    } catch (error) {
      console.error(`Error fetching ${scope} news:`, error);
      return [];
    }
  }

  function analyzeOpportunities(articles) {
    const opportunities = [];

    articles.forEach(article => {
      const text = `${article.title} ${article.description || ''}`.toLowerCase();
      const foundIndicators = [];
      let opportunityScore = 0;

      // Check for opportunity indicators
      Object.keys(opportunityIndicators).forEach(category => {
        opportunityIndicators[category].forEach(keyword => {
          if (text.includes(keyword.toLowerCase())) {
            foundIndicators.push({ category, keyword });
            opportunityScore += 1;
          }
        });
      });

      // Score threshold for business opportunity
      if (opportunityScore >= 2) {
        const categories = [...new Set(foundIndicators.map(i => i.category))];
        const type = determineOpportunityType(categories, text);
        
        opportunities.push({
          article,
          score: opportunityScore,
          categories,
          type,
          indicators: foundIndicators,
          relevance: calculateRelevance(text, categories)
        });
      }
    });

    // Sort by score and relevance
    return opportunities.sort((a, b) => {
      const scoreDiff = b.score - a.score;
      if (scoreDiff !== 0) return scoreDiff;
      return b.relevance - a.relevance;
    });
  }

  function determineOpportunityType(categories, text) {
    if (categories.includes('technology') && categories.includes('market')) {
      return 'Tech Market Opportunity';
    }
    if (categories.includes('shortage') || categories.includes('crisis')) {
      return 'Problem-Solution Opportunity';
    }
    if (categories.includes('investment') || categories.includes('funding')) {
      return 'Investment Opportunity';
    }
    if (categories.includes('regulation')) {
      return 'Regulatory Opportunity';
    }
    if (categories.includes('newSector')) {
      return 'Emerging Sector';
    }
    if (categories.includes('consumer')) {
      return 'Consumer Trend Opportunity';
    }
    return 'Business Opportunity';
  }

  function calculateRelevance(text, categories) {
    let relevance = 0;
    
    // Higher relevance for specific business terms
    const highValueTerms = ['startup', 'company', 'business', 'market', 'industry', 'sector'];
    highValueTerms.forEach(term => {
      if (text.includes(term)) relevance += 2;
    });

    // Higher relevance for action-oriented terms
    const actionTerms = ['launch', 'expand', 'invest', 'develop', 'create', 'build'];
    actionTerms.forEach(term => {
      if (text.includes(term)) relevance += 1.5;
    });

    return relevance;
  }

  function displayOpportunities(opportunities) {
    if (opportunities.length === 0) {
      opportunitiesList.innerHTML = '<p class="no-results">No business opportunities detected in recent news.</p>';
      return;
    }

    opportunitiesList.innerHTML = opportunities.map(opp => {
      const date = new Date(opp.article.publishedAt).toLocaleDateString();
      const categories = opp.categories.map(c => `<span class="category-tag">${c}</span>`).join('');
      
      return `
        <div class="opportunity-card">
          <div class="opportunity-header">
            <h3>${opp.article.title}</h3>
            <div class="opportunity-meta">
              <span class="opportunity-type">${opp.type}</span>
              <span class="opportunity-score">Score: ${opp.score}</span>
            </div>
          </div>
          <p class="opportunity-description">${opp.article.description || 'No description available'}</p>
          <div class="opportunity-details">
            <div class="opportunity-categories">${categories}</div>
            <div class="opportunity-source">
              <span class="scope-badge scope-${opp.article.scope}">${opp.article.scope}</span>
              <span class="source-name">${opp.article.source?.name || 'Unknown'}</span>
              <span class="article-date">${date}</span>
            </div>
          </div>
          <a href="${opp.article.url}" target="_blank" class="read-more">Read full article →</a>
        </div>
      `;
    }).join('');
  }

  function displayArticles(articles) {
    if (articles.length === 0) {
      articlesList.innerHTML = '<p class="no-results">No articles found.</p>';
      return;
    }

    articlesList.innerHTML = articles.slice(0, 10).map(article => {
      const date = new Date(article.publishedAt).toLocaleDateString();
      
      return `
        <div class="article-card">
          <div class="article-header">
            <h4>${article.title}</h4>
            <span class="scope-badge scope-${article.scope}">${article.scope}</span>
          </div>
          <p class="article-description">${article.description || 'No description available'}</p>
          <div class="article-footer">
            <span class="source-name">${article.source?.name || 'Unknown'}</span>
            <span class="article-date">${date}</span>
            <a href="${article.url}" target="_blank" class="read-more-small">Read →</a>
          </div>
        </div>
      `;
    }).join('');
  }

  function showStatus(message, type = 'info') {
    status.textContent = message;
    status.className = `status status-${type}`;
    status.style.display = 'block';
    
    if (type === 'success' || type === 'error') {
      setTimeout(() => {
        status.style.display = 'none';
      }, 5000);
    }
  }
});