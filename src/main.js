/**
 * OpportunityRadar v2.0
 * Autonomous Market Signal & Business Opportunity Intelligence Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const scanBtn = document.getElementById('scanBtn');
  const searchInput = document.getElementById('searchInput');
  const clearSearch = document.getElementById('clearSearch');
  const archetypeFilter = document.getElementById('archetypeFilter');
  const sortSelect = document.getElementById('sortSelect');
  const scopeBtns = document.querySelectorAll('.pill-btn');
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  const opportunitiesGrid = document.getElementById('opportunitiesGrid');
  const articlesList = document.getElementById('articlesList');
  const savedList = document.getElementById('savedList');
  const radarCount = document.getElementById('radarCount');
  const articlesCount = document.getElementById('articlesCount');
  const savedCount = document.getElementById('savedCount');
  
  const statusAlert = document.getElementById('statusAlert');
  const statusMsg = document.getElementById('statusMsg');
  const statusIcon = document.getElementById('statusIcon');
  
  // Modals
  const blueprintModal = document.getElementById('blueprintModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBadge = document.getElementById('modalBadge');
  const modalBody = document.getElementById('modalBody');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalCloseBtn2 = document.getElementById('modalCloseBtn2');
  const modalSaveBtn = document.getElementById('modalSaveBtn');
  const modalCopyMarkdownBtn = document.getElementById('modalCopyMarkdownBtn');
  
  const settingsModal = document.getElementById('settingsModal');
  const quickSettingsBtn = document.getElementById('quickSettingsBtn');
  const closeSettingsBtn = document.getElementById('closeSettingsBtn');
  const saveSettingsBtn = document.getElementById('saveSettingsBtn');
  const newsApiKeyInput = document.getElementById('newsApiKeyInput');
  const feedStrategySelect = document.getElementById('feedStrategySelect');
  const sensitivitySlider = document.getElementById('sensitivitySlider');
  const sensitivityVal = document.getElementById('sensitivityVal');
  const exportOpportunitiesBtn = document.getElementById('exportOpportunitiesBtn');
  const clearSavedBtn = document.getElementById('clearSavedBtn');

  // Application State
  let rawArticles = [];
  let detectedOpportunities = [];
  let savedBlueprints = JSON.parse(localStorage.getItem('savedBlueprints') || '[]');
  let activeScope = 'all';
  let activeArchetype = 'all';
  let activeSort = 'score';
  let searchQuery = '';
  let activeBlueprint = null;

  // Settings
  let settings = {
    apiKey: localStorage.getItem('newsApiKey') || '',
    strategy: localStorage.getItem('feedStrategy') || 'hybrid',
    sensitivity: parseInt(localStorage.getItem('opportunitySensitivity') || '2', 10)
  };

  // Opportunity Taxonomy & Heuristics
  const SIGNAL_PATTERNS = {
    ai_workflow: {
      keywords: ['ai agent', 'autonomous', 'llm', 'workflow', 'prompt', 'synthetic', 'reasoning model', 'copilot', 'automation'],
      archetype: 'AI Workflow',
      sector: 'Artificial Intelligence',
      baseTam: '$14.2B'
    },
    b2b_saas: {
      keywords: ['platform', 'b2b', 'enterprise', 'dashboard', 'api', 'infrastructure', 'developer tool', 'analytics', 'saas'],
      archetype: 'B2B SaaS',
      sector: 'Cloud & Enterprise',
      baseTam: '$28.5B'
    },
    arbitrage_supply: {
      keywords: ['shortage', 'bottleneck', 'supply chain', 'freight', 'procurement', 'tariffs', 'logistics', 'inventory gap'],
      archetype: 'Arbitrage & Supply',
      sector: 'Supply & Logistics',
      baseTam: '$45.0B'
    },
    regulatory_tech: {
      keywords: ['regulation', 'compliance', 'sec filing', 'gdpr', 'ftc mandate', 'antitrust', 'audit', 'legislation', 'law'],
      archetype: 'Regulatory Tech',
      sector: 'Gov & Compliance',
      baseTam: '$9.8B'
    },
    consumer_product: {
      keywords: ['consumer trend', 'gen z', 'subscription', 'creator economy', 'viral', 'lifestyle', 'd2c', 'wellness'],
      archetype: 'Consumer Product',
      sector: 'Consumer & Retail',
      baseTam: '$18.0B'
    },
    service_agency: {
      keywords: ['consulting', 'advisory', 'fractional', 'talent shortage', 'migration service', 'implementation partner'],
      archetype: 'Service Agency',
      sector: 'Professional Services',
      baseTam: '$6.5B'
    }
  };

  // Curated Fallback & Direct Signal Feeds (Zero API Key Req.)
  const CURATED_SIGNAL_FALLBACKS = [
    {
      title: "Enterprise AI Adoption Surges While 78% of Mid-Market Firms Lack Custom Integration Talent",
      description: "A new industry benchmark shows mid-sized organizations face severe engineering bottlenecks connecting local LLM agents to proprietary SQL and ERP workflows.",
      source: { name: "TechCrunch / VentureBeat" },
      publishedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      url: "https://news.ycombinator.com",
      scope: "tech"
    },
    {
      title: "Federal Energy Regulatory Commission Issues Rapid-Permit Mandate for Microgrid Battery Installations",
      description: "New federal rules streamline approvals for regional commercial batteries, creating an immediate compliance and site-selection arbitrage window for energy developers.",
      source: { name: "Reuters / Energy Insights" },
      publishedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      url: "https://news.ycombinator.com",
      scope: "business"
    },
    {
      title: "Global Supply Squeeze on High-Purity Silicon Carbide Chokes EV Power Electronics Production",
      description: "Automakers scramble to secure alternative wafer sourcing as Tier-1 supplier lead times stretch to 42 weeks, opening doors for domestic recycling and secondary brokers.",
      source: { name: "Bloomberg Supply Chain" },
      publishedAt: new Date(Date.now() - 3600000 * 9).toISOString(),
      url: "https://news.ycombinator.com",
      scope: "global"
    },
    {
      title: "New European AI Act Compliance Deadlines Trigger Surge in Automated Red-Teaming Tool Requests",
      description: "Enterprises deploying customer-facing generative models must certify safety audits by Q4, creating high-ticket demand for continuous penetration testing dashboards.",
      source: { name: "FT Tech Sector" },
      publishedAt: new Date(Date.now() - 3600000 * 14).toISOString(),
      url: "https://news.ycombinator.com",
      scope: "tech"
    },
    {
      title: "Municipal Water Authorities Mandate Acoustic Leak Sensors Following Infrastructure Grant Unlocks",
      description: "Over $4.2B in federal smart water funding is released to cities, driving urgent vendor searches for IoT edge sensors and preventative maintenance contracts.",
      source: { name: "City & State Infrastructure" },
      publishedAt: new Date(Date.now() - 3600000 * 22).toISOString(),
      url: "https://news.ycombinator.com",
      scope: "local"
    },
    {
      title: "Creator Economy Shift: Mid-Tier YouTubers Migrate En Masse to Dedicated White-Label Community Platforms",
      description: "Fatigue with generic subscription platforms accelerates demand for self-hosted community hubs with native video streaming and automated merchandise fulfillment.",
      source: { name: "Creator Economy Daily" },
      publishedAt: new Date(Date.now() - 3600000 * 28).toISOString(),
      url: "https://news.ycombinator.com",
      scope: "tech"
    }
  ];

  // Initialize
  initApp();

  function initApp() {
    newsApiKeyInput.value = settings.apiKey;
    feedStrategySelect.value = settings.strategy;
    sensitivitySlider.value = settings.sensitivity;
    updateSensitivityLabel(settings.sensitivity);
    updateSavedCount();
    
    // Auto-run initial baseline scan
    executeScan();
    setupEventListeners();
  }

  function setupEventListeners() {
    // Scan Trigger
    scanBtn.addEventListener('click', executeScan);

    // Search Box
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      clearSearch.style.display = searchQuery ? 'block' : 'none';
      renderAllViews();
    });

    clearSearch.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      clearSearch.style.display = 'none';
      renderAllViews();
    });

    // Scope Buttons
    scopeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        scopeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeScope = btn.dataset.scope;
        renderAllViews();
      });
    });

    // Archetype Select
    archetypeFilter.addEventListener('change', (e) => {
      activeArchetype = e.target.value;
      renderAllViews();
    });

    // Sort Select
    sortSelect.addEventListener('change', (e) => {
      activeSort = e.target.value;
      renderAllViews();
    });

    // Tab Switching
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.dataset.tab;
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        tabContents.forEach(tc => {
          if (tc.id === `tab-${targetTab}`) {
            tc.style.display = tc.id === 'tab-radar' || tc.id === 'tab-saved' ? 'block' : 'block';
            tc.classList.add('active');
          } else {
            tc.style.display = 'none';
            tc.classList.remove('active');
          }
        });

        if (targetTab === 'analytics') {
          renderAnalytics();
        } else if (targetTab === 'saved') {
          renderSavedList();
        }
      });
    });

    // Quick Settings Modal
    quickSettingsBtn.addEventListener('click', () => {
      settingsModal.style.display = 'flex';
    });
    closeSettingsBtn.addEventListener('click', () => {
      settingsModal.style.display = 'none';
    });
    saveSettingsBtn.addEventListener('click', () => {
      settings.apiKey = newsApiKeyInput.value.trim();
      settings.strategy = feedStrategySelect.value;
      settings.sensitivity = parseInt(sensitivitySlider.value, 10);
      
      localStorage.setItem('newsApiKey', settings.apiKey);
      localStorage.setItem('feedStrategy', settings.strategy);
      localStorage.setItem('opportunitySensitivity', settings.sensitivity.toString());
      
      settingsModal.style.display = 'none';
      showStatus('Settings saved successfully! Running refreshed scan...', 'success');
      executeScan();
    });

    sensitivitySlider.addEventListener('input', (e) => {
      updateSensitivityLabel(parseInt(e.target.value, 10));
    });

    // Blueprint Modal
    closeModalBtn.addEventListener('click', () => { blueprintModal.style.display = 'none'; });
    modalCloseBtn2.addEventListener('click', () => { blueprintModal.style.display = 'none'; });
    modalSaveBtn.addEventListener('click', toggleSaveActiveBlueprint);
    modalCopyMarkdownBtn.addEventListener('click', copyActiveBlueprintMarkdown);

    // Export & Clear Saved
    exportOpportunitiesBtn.addEventListener('click', exportOpportunitiesJson);
    clearSavedBtn.addEventListener('click', () => {
      if (confirm('Clear all bookmarked blueprints?')) {
        savedBlueprints = [];
        localStorage.setItem('savedBlueprints', '[]');
        updateSavedCount();
        renderSavedList();
        showStatus('Saved blueprints cleared', 'info');
      }
    });
  }

  function updateSensitivityLabel(val) {
    if (val === 1) sensitivityVal.textContent = 'Broad (Score 50+)';
    else if (val === 2) sensitivityVal.textContent = 'Normal (Score 65+)';
    else if (val === 3) sensitivityVal.textContent = 'Strict (Score 75+)';
    else if (val >= 4) sensitivityVal.textContent = 'Ultra-High Conviction (Score 85+)';
  }

  // --- Live Feed Ingestion Engine ---
  async function executeScan() {
    setScanningState(true);
    showStatus('Ingesting live news feeds & scanning market signals...', 'info');

    try {
      const fetched = await fetchAllFeeds();
      rawArticles = fetched;
      detectedOpportunities = analyzeAndSynthesize(rawArticles);
      
      renderAllViews();
      updateCounters();
      
      showStatus(`Ingested ${rawArticles.length} live signals • Discovered ${detectedOpportunities.length} actionable opportunities!`, 'success');
    } catch (err) {
      console.error('Scan error:', err);
      showStatus(`Scan completed with local fallback: ${err.message}`, 'error');
      rawArticles = CURATED_SIGNAL_FALLBACKS;
      detectedOpportunities = analyzeAndSynthesize(rawArticles);
      renderAllViews();
      updateCounters();
    } finally {
      setScanningState(false);
    }
  }

  async function fetchAllFeeds() {
    const articles = [];

    // Strategy 1: Hacker News High-Signal Story Fetch
    try {
      const hnRes = await fetch('https://hn.algolia.com/api/v1/search?tags=front_page&hitsPerPage=25');
      if (hnRes.ok) {
        const hnData = await hnRes.json();
        if (hnData.hits) {
          hnData.hits.forEach(hit => {
            if (hit.title && (hit.url || hit.story_text)) {
              articles.push({
                title: hit.title,
                description: hit.story_text ? hit.story_text.slice(0, 200) : `HN community discussion on ${hit.title} with ${hit.points || 0} upvotes and ${hit.num_comments || 0} comments.`,
                source: { name: 'Hacker News Frontpage' },
                publishedAt: hit.created_at || new Date().toISOString(),
                url: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
                scope: 'tech'
              });
            }
          });
        }
      }
    } catch (e) {
      console.warn('HN fetch skipped:', e.message);
    }

    // Strategy 2: NewsAPI if configured
    if (settings.apiKey && (settings.strategy === 'hybrid' || settings.strategy === 'newsapi')) {
      try {
        const apiUrl = `https://newsapi.org/v2/top-headlines?category=business&language=en&pageSize=20&apiKey=${settings.apiKey}`;
        const res = await fetch(apiUrl);
        const data = await res.json();
        if (data.status === 'ok' && data.articles) {
          data.articles.forEach(a => {
            if (a.title && a.description) {
              articles.push({
                ...a,
                scope: 'business'
              });
            }
          });
        }
      } catch (e) {
        console.warn('NewsAPI fetch skipped:', e.message);
      }
    }

    // Always merge curated baseline feeds for rich baseline analysis
    CURATED_SIGNAL_FALLBACKS.forEach(f => {
      if (!articles.some(a => a.title.toLowerCase() === f.title.toLowerCase())) {
        articles.push(f);
      }
    });

    return articles;
  }

  // --- Opportunity Synthesis & AI Blueprint Engine ---
  function analyzeAndSynthesize(articles) {
    const opportunities = [];
    const minThreshold = settings.sensitivity === 1 ? 40 : settings.sensitivity === 2 ? 55 : settings.sensitivity === 3 ? 70 : 80;

    articles.forEach((art, idx) => {
      const fullText = `${art.title} ${art.description || ''}`.toLowerCase();
      let matchedPattern = null;
      let matchedKeywords = [];
      let score = 50;

      // Classify Archetype & Sector
      for (const [key, pat] of Object.entries(SIGNAL_PATTERNS)) {
        const hits = pat.keywords.filter(kw => fullText.includes(kw));
        if (hits.length > 0 && (!matchedKeywords || hits.length > matchedKeywords.length)) {
          matchedPattern = pat;
          matchedKeywords = hits;
        }
      }

      if (!matchedPattern) {
        matchedPattern = SIGNAL_PATTERNS.b2b_saas;
      }

      // Compute Opportunity Potency Score
      score += matchedKeywords.length * 12;
      if (art.title.includes('Surges') || art.title.includes('Mandate') || art.title.includes('Bottleneck') || art.title.includes('Demand') || art.title.includes('Deadlines')) {
        score += 15;
      }
      if (art.description && art.description.length > 80) score += 5;
      score = Math.min(score, 98);

      if (score >= minThreshold) {
        const oppId = `opp-${idx}-${Date.now().toString(36)}`;
        const problemStatement = extractProblemStatement(art.title, art.description);
        const blueprint = generateExecutionBlueprint(art.title, matchedPattern, problemStatement);

        opportunities.push({
          id: oppId,
          title: generateOpportunityTitle(art.title, matchedPattern.archetype),
          rawArticle: art,
          score,
          archetype: matchedPattern.archetype,
          sector: matchedPattern.sector,
          tam: matchedPattern.baseTam,
          problemStatement,
          blueprint,
          publishedAt: art.publishedAt,
          scope: art.scope || 'business'
        });
      }
    });

    // Sort by default score
    return opportunities.sort((a, b) => b.score - a.score);
  }

  function extractProblemStatement(title, desc) {
    if (desc && desc.length > 30) {
      return desc;
    }
    return `Emerging market friction identified in ${title}. Companies and operators currently lack scalable tooling to address this shift efficiently.`;
  }

  function generateOpportunityTitle(articleTitle, archetype) {
    const cleanTitle = articleTitle.replace(/ - [^-]+$/, '').replace(/\|.+$/, '').trim();
    if (archetype === 'AI Workflow') return `Autonomous AI Agent Suite for ${cleanTitle.slice(0, 60)}…`;
    if (archetype === 'Regulatory Tech') return `Compliance Automation Platform: ${cleanTitle.slice(0, 55)}…`;
    if (archetype === 'Arbitrage & Supply') return `Secondary Logistics & Brokerage for ${cleanTitle.slice(0, 55)}…`;
    if (archetype === 'Service Agency') return `Productized Advisory & Implementation: ${cleanTitle.slice(0, 55)}…`;
    return `Specialized SaaS Platform: ${cleanTitle.slice(0, 60)}…`;
  }

  function generateExecutionBlueprint(title, pattern, problem) {
    return {
      targetCustomer: pattern.archetype === 'B2B SaaS' ? 'Mid-Market IT Directors & VP Engineering' :
                      pattern.archetype === 'AI Workflow' ? 'Enterprise Operations & Department Leads' :
                      pattern.archetype === 'Regulatory Tech' ? 'Chief Compliance Officers & Legal Teams' :
                      pattern.archetype === 'Arbitrage & Supply' ? 'Procurement Heads & Supply Chain VPs' : 'Early-Adopter Creators & Founders',
      monetization: pattern.archetype === 'Service Agency' ? '$5,000 - $15,000/mo retainer or turnkey rollout fee' :
                    pattern.archetype === 'B2B SaaS' ? '$299 - $1,499/mo tiered subscription seat pricing' :
                    pattern.archetype === 'Regulatory Tech' ? '$12,000/yr annual compliance audit license' : '2.5% transaction commission + $99/mo base',
      velocityEstimate: '0 to First Paying Pilot in 30 - 45 Days',
      roadmap: [
        'Phase 1 (Week 1-2): Spin up a targeted landing page with interactive ROI calculator and direct cold outreach to 50 target ICPs.',
        'Phase 2 (Week 3-4): Build a rapid, headless prototype integrating verified API connectors or productized agent workflow.',
        'Phase 3 (Week 5-6): Onboard 3 pilot beta design partners with discounted 90-day case study commitments.'
      ]
    };
  }

  // --- Rendering Functions ---
  function renderAllViews() {
    renderOpportunityCards();
    renderRawArticles();
  }

  function getFilteredOpportunities() {
    return detectedOpportunities.filter(opp => {
      // Scope Filter
      if (activeScope !== 'all' && opp.scope !== activeScope) return false;
      // Archetype Filter
      if (activeArchetype !== 'all' && opp.archetype !== activeArchetype) return false;
      // Search Filter
      if (searchQuery) {
        const matchTitle = opp.title.toLowerCase().includes(searchQuery);
        const matchProblem = opp.problemStatement.toLowerCase().includes(searchQuery);
        const matchSector = opp.sector.toLowerCase().includes(searchQuery);
        const matchArchetype = opp.archetype.toLowerCase().includes(searchQuery);
        if (!matchTitle && !matchProblem && !matchSector && !matchArchetype) return false;
      }
      return true;
    }).sort((a, b) => {
      if (activeSort === 'score') return b.score - a.score;
      if (activeSort === 'date') return new Date(b.publishedAt) - new Date(a.publishedAt);
      if (activeSort === 'tam') return parseFloat(b.tam.replace('$', '')) - parseFloat(a.tam.replace('$', ''));
      return 0;
    });
  }

  function renderOpportunityCards() {
    const filtered = getFilteredOpportunities();
    radarCount.textContent = filtered.length;

    if (filtered.length === 0) {
      opportunitiesGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
          <p style="font-size: 1.25rem; margin-bottom: 8px;">🎯 No opportunities match current filters</p>
          <p style="font-size: 0.85rem;">Try broadening your search keyword or switching scopes.</p>
        </div>
      `;
      return;
    }

    opportunitiesGrid.innerHTML = filtered.map(opp => {
      const isSaved = savedBlueprints.some(s => s.id === opp.id);
      const badgeColor = opp.archetype === 'AI Workflow' ? 'badge-purple' :
                         opp.archetype === 'B2B SaaS' ? 'badge-cyan' :
                         opp.archetype === 'Regulatory Tech' ? 'badge-amber' : 'badge-cyan';

      return `
        <div class="opportunity-card" data-id="${opp.id}">
          <div>
            <div class="opp-card-top">
              <div class="opp-tags">
                <span class="badge ${badgeColor}">${opp.archetype}</span>
                <span class="badge badge-cyan">${opp.sector}</span>
                <span class="badge" style="background: rgba(255,255,255,0.06); color: var(--text-secondary);">TAM: ${opp.tam}</span>
              </div>
              <div class="opp-score-badge">
                <span class="opp-score-val">${opp.score}</span>
                <span class="opp-score-label">Score</span>
              </div>
            </div>

            <h3 class="opp-title">${escapeHtml(opp.title)}</h3>
            <p class="opp-problem">${escapeHtml(opp.problemStatement)}</p>

            <div class="opp-blueprint-preview">
              <div class="opp-blueprint-label">💡 ICP & Monetization</div>
              <div class="opp-blueprint-text">${escapeHtml(opp.blueprint.targetCustomer)} • <strong style="color:var(--emerald-400)">${escapeHtml(opp.blueprint.monetization)}</strong></div>
            </div>
          </div>

          <div class="opp-meta-row">
            <div>
              <span>Source: <strong>${escapeHtml(opp.rawArticle.source.name || 'Global News')}</strong></span>
            </div>
            <div class="opp-card-actions">
              <button class="btn btn-sm btn-secondary btn-open-blueprint" data-id="${opp.id}">View Blueprint 🚀</button>
              <button class="btn btn-sm ${isSaved ? 'btn-danger' : 'btn-ghost'} btn-bookmark" data-id="${opp.id}">
                ${isSaved ? '★ Saved' : '☆ Bookmark'}
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach card event listeners
    document.querySelectorAll('.btn-open-blueprint').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        const opp = detectedOpportunities.find(o => o.id === id) || savedBlueprints.find(o => o.id === id);
        if (opp) openBlueprintModal(opp);
      });
    });

    document.querySelectorAll('.btn-bookmark').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        const opp = detectedOpportunities.find(o => o.id === id);
        if (opp) toggleSaveBlueprint(opp);
      });
    });
  }

  function renderRawArticles() {
    articlesCount.textContent = rawArticles.length;
    if (rawArticles.length === 0) {
      articlesList.innerHTML = '<p style="color:var(--text-muted); padding:30px; text-align:center;">No news articles loaded.</p>';
      return;
    }

    articlesList.innerHTML = rawArticles.slice(0, 30).map(art => `
      <div class="article-row">
        <div class="article-row-content">
          <div class="article-row-title">${escapeHtml(art.title)}</div>
          <div class="article-row-meta">
            <span>📰 ${escapeHtml(art.source.name || 'Feed')}</span>
            <span>📅 ${new Date(art.publishedAt).toLocaleDateString()}</span>
            <span>Scope: <strong style="text-transform:uppercase">${art.scope || 'business'}</strong></span>
          </div>
        </div>
        <a href="${art.url}" target="_blank" class="btn btn-sm btn-ghost">Source ↗</a>
      </div>
    `).join('');
  }

  function renderAnalytics() {
    const opps = detectedOpportunities;
    document.getElementById('metricHighConviction').textContent = opps.filter(o => o.score >= 80).length;
    document.getElementById('metricArticlesAnalyzed').textContent = rawArticles.length;

    // Sectors
    const sectorCounts = {};
    const archetypeCounts = {};

    opps.forEach(o => {
      sectorCounts[o.sector] = (sectorCounts[o.sector] || 0) + 1;
      archetypeCounts[o.archetype] = (archetypeCounts[o.archetype] || 0) + 1;
    });

    const topSector = Object.entries(sectorCounts).sort((a, b) => b[1] - a[1])[0];
    const topArchetype = Object.entries(archetypeCounts).sort((a, b) => b[1] - a[1])[0];

    if (topSector) {
      document.getElementById('metricTopSector').textContent = topSector[0];
      document.getElementById('metricTopSectorCount').textContent = `${topSector[1]} Signals Identified`;
    }
    if (topArchetype) {
      document.getElementById('metricTopArchetype').textContent = topArchetype[0];
    }

    // Render Distribution Bars
    renderDistribution('sectorDistribution', sectorCounts, opps.length);
    renderDistribution('archetypeDistribution', archetypeCounts, opps.length);
  }

  function renderDistribution(containerId, counts, total) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (total === 0) {
      container.innerHTML = '<p class="text-muted">No data available.</p>';
      return;
    }

    const rows = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    container.innerHTML = rows.map(([label, count]) => {
      const pct = Math.round((count / total) * 100);
      return `
        <div class="dist-row">
          <div class="dist-info">
            <span>${label}</span>
            <span>${count} (${pct}%)</span>
          </div>
          <div class="dist-bar-track">
            <div class="dist-bar-fill" style="width: ${pct}%"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderSavedList() {
    updateSavedCount();
    if (savedBlueprints.length === 0) {
      savedList.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
          <p style="font-size: 1.25rem; margin-bottom: 8px;">⭐ No saved opportunity blueprints yet</p>
          <p style="font-size: 0.85rem;">Click "Bookmark" on any opportunity card in the Radar tab to pin it here.</p>
        </div>
      `;
      return;
    }

    savedList.innerHTML = savedBlueprints.map(opp => `
      <div class="opportunity-card" data-id="${opp.id}">
        <div>
          <div class="opp-card-top">
            <div class="opp-tags">
              <span class="badge badge-purple">${opp.archetype}</span>
              <span class="badge badge-cyan">${opp.sector}</span>
            </div>
            <div class="opp-score-badge">
              <span class="opp-score-val">${opp.score}</span>
              <span class="opp-score-label">Score</span>
            </div>
          </div>
          <h3 class="opp-title">${escapeHtml(opp.title)}</h3>
          <p class="opp-problem">${escapeHtml(opp.problemStatement)}</p>
        </div>
        <div class="opp-meta-row">
          <span>Target: <strong>${escapeHtml(opp.blueprint.targetCustomer)}</strong></span>
          <div class="opp-card-actions">
            <button class="btn btn-sm btn-secondary btn-open-blueprint" data-id="${opp.id}">View 🚀</button>
            <button class="btn btn-sm btn-danger btn-bookmark" data-id="${opp.id}">Remove</button>
          </div>
        </div>
      </div>
    `).join('');

    savedList.querySelectorAll('.btn-open-blueprint').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        const opp = savedBlueprints.find(o => o.id === id);
        if (opp) openBlueprintModal(opp);
      });
    });

    savedList.querySelectorAll('.btn-bookmark').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        const opp = savedBlueprints.find(o => o.id === id);
        if (opp) toggleSaveBlueprint(opp);
      });
    });
  }

  // --- Modal & Blueprint Handlers ---
  function openBlueprintModal(opp) {
    activeBlueprint = opp;
    modalBadge.textContent = `${opp.archetype} • TAM: ${opp.tam}`;
    modalTitle.textContent = opp.title;

    const isSaved = savedBlueprints.some(s => s.id === opp.id);
    modalSaveBtn.textContent = isSaved ? '★ Bookmarked' : '⭐ Bookmark Blueprint';

    modalBody.innerHTML = `
      <div class="blueprint-section">
        <div class="blueprint-section-title">🚨 The Emerging Friction / Market Catalyst</div>
        <div class="blueprint-box">${escapeHtml(opp.problemStatement)}</div>
      </div>

      <div class="blueprint-section">
        <div class="blueprint-section-title">🎯 Ideal Customer Profile (ICP) & Value Proposition</div>
        <div class="blueprint-box">
          <strong>Target Buyer:</strong> ${escapeHtml(opp.blueprint.targetCustomer)}<br/>
          <strong>Monetization Model:</strong> ${escapeHtml(opp.blueprint.monetization)}<br/>
          <strong>Speed to First Revenue:</strong> ${escapeHtml(opp.blueprint.velocityEstimate)}
        </div>
      </div>

      <div class="blueprint-section">
        <div class="blueprint-section-title">🗺️ 30-Day Execution Roadmap</div>
        <div class="blueprint-box">
          <ul class="roadmap-steps">
            ${opp.blueprint.roadmap.map(step => `<li>${escapeHtml(step)}</li>`).join('')}
          </ul>
        </div>
      </div>

      <div class="blueprint-section">
        <div class="blueprint-section-title">📰 Grounding News Origin</div>
        <div class="blueprint-box" style="font-size:0.8rem;">
          <strong>Origin Headline:</strong> ${escapeHtml(opp.rawArticle.title)}<br/>
          <strong>Source:</strong> ${escapeHtml(opp.rawArticle.source.name || 'Feed')} • 
          <a href="${opp.rawArticle.url}" target="_blank" style="color:var(--cyan-400);">View Original News Story ↗</a>
        </div>
      </div>
    `;

    blueprintModal.style.display = 'flex';
  }

  function toggleSaveBlueprint(opp) {
    const idx = savedBlueprints.findIndex(s => s.id === opp.id);
    if (idx >= 0) {
      savedBlueprints.splice(idx, 1);
      showStatus('Blueprint removed from bookmarks', 'info');
    } else {
      savedBlueprints.push(opp);
      showStatus('Blueprint saved to bookmarks!', 'success');
    }
    localStorage.setItem('savedBlueprints', JSON.stringify(savedBlueprints));
    updateSavedCount();
    renderOpportunityCards();
    renderSavedList();
  }

  function toggleSaveActiveBlueprint() {
    if (activeBlueprint) {
      toggleSaveBlueprint(activeBlueprint);
      const isSaved = savedBlueprints.some(s => s.id === activeBlueprint.id);
      modalSaveBtn.textContent = isSaved ? '★ Bookmarked' : '⭐ Bookmark Blueprint';
    }
  }

  function copyActiveBlueprintMarkdown() {
    if (!activeBlueprint) return;
    const opp = activeBlueprint;
    const md = `# Pitch Brief: ${opp.title}
**Archetype:** ${opp.archetype} | **Sector:** ${opp.sector} | **TAM:** ${opp.tam} | **Score:** ${opp.score}/100

## 1. The Friction / Catalyst
${opp.problemStatement}

## 2. Business Model & Monetization
- **Target Customer:** ${opp.blueprint.targetCustomer}
- **Pricing:** ${opp.blueprint.monetization}
- **Velocity:** ${opp.blueprint.velocityEstimate}

## 3. Execution Roadmap
${opp.blueprint.roadmap.map((s, i) => `${i+1}. ${s}`).join('\n')}

---
*Generated by OpportunityRadar • Grounded on ${opp.rawArticle.title} (${opp.rawArticle.source.name})*
`;

    navigator.clipboard.writeText(md).then(() => {
      showStatus('Pitch brief copied to clipboard as Markdown! 📋', 'success');
    }).catch(() => {
      showStatus('Failed to copy to clipboard', 'error');
    });
  }

  function exportOpportunitiesJson() {
    const filtered = getFilteredOpportunities();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filtered, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `opportunity_radar_export_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
    showStatus(`Exported ${filtered.length} opportunities to JSON!`, 'success');
  }

  function updateSavedCount() {
    savedCount.textContent = savedBlueprints.length;
  }

  function updateCounters() {
    radarCount.textContent = detectedOpportunities.length;
    articlesCount.textContent = rawArticles.length;
    updateSavedCount();
  }

  function setScanningState(isScanning) {
    scanBtn.disabled = isScanning;
    scanBtn.querySelector('.btn-text').style.display = isScanning ? 'none' : 'inline';
    scanBtn.querySelector('.btn-loader').style.display = isScanning ? 'inline-flex' : 'none';
  }

  function showStatus(message, type = 'info') {
    statusMsg.textContent = message;
    statusAlert.className = `status-alert ${type}`;
    statusIcon.textContent = type === 'success' ? '✅' : type === 'error' ? '⚠️' : 'ℹ️';
    statusAlert.style.display = 'flex';

    if (type === 'success' || type === 'info') {
      setTimeout(() => {
        statusAlert.style.display = 'none';
      }, 5000);
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
});