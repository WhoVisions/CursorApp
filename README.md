# ⚡ OpportunityRadar (CursorApp)
> **Autonomous Market Signal & Business Opportunity Intelligence Engine**

OpportunityRadar scans live multi-source news, market breakthroughs, regulatory shifts, and technology headlines to automatically synthesize actionable, high-velocity business opportunities, monetization models, and 30-day execution roadmaps.

---

## 🌟 Key Capabilities

1. **Zero-API-Key Out-of-the-Box Ingestion**
   - Ingests direct live RSS streams (Hacker News high-signal frontpage, Tech & Venture feeds) without requiring paid API keys or subscription signups.
   - Optional hybrid support for NewsAPI.org for deep custom international queries.

2. **Autonomous Opportunity Synthesis Engine**
   - Evaluates market friction, catalyst events, and buyer pain points.
   - Calculates a multi-factor **Opportunity Score (0-100)** based on urgency, market readiness, and monetization velocity.
   - Classifies opportunities into actionable business archetypes:
     - 🤖 **AI Workflow & Autonomous Agents**
     - ☁️ **B2B SaaS / Developer Tooling**
     - 📦 **Arbitrage & Supply Chain Brokerage**
     - ⚖️ **Regulatory Tech & Compliance Automation**
     - 🛍️ **Consumer Products & Creator Economy**
     - 💼 **High-Ticket Advisory & Productized Agency**

3. **Complete Startup Blueprints on Every Signal**
   - **Target Customer Profile (ICP)** & decision-maker identification.
   - **Monetization Structure & Pricing Strategy** (e.g. $299-$1,499/mo tiered SaaS vs $10k/mo retainers).
   - **30-Day Phased Execution Roadmap** (from landing page validation to first paid pilot).
   - One-click **Markdown Pitch Brief Export** ready to paste into documents or pitch decks.

4. **Market Pulse & Sector Analytics**
   - Real-time visualization of opportunity distributions across sectors and archetypes.
   - High-conviction signal radar (Score 80+).

5. **Local Bookmark Vault & Data Export**
   - Pin high-conviction blueprints to your private browser storage.
   - Export filtered opportunities to JSON with a single click.

---

## 🚀 Quick Start

### 1. Run Locally

Open the directory and start a local static server:

```bash
# Using npx serve (recommended)
npx serve . -l 5000

# Or using Python's built-in HTTP server
python -m http.server 5000
```

Open your browser to `http://localhost:5000`.

### 2. Zero-Config Usage
- Click **"Execute Scan"** to instantly ingest live news signals and discover business opportunities.
- Use the **Search Bar** or **Archetype Filter** to narrow down specific domains (e.g. *AI*, *Energy*, *B2B SaaS*).
- Click **"View Blueprint 🚀"** on any card to view the target customer, pricing model, and 30-day roadmap.
- Click **"📋 Copy Pitch (Markdown)"** to grab a ready-to-use executive brief.

---

## 🛠️ Tech Architecture

- **Frontend**: Pure modern Vanilla JavaScript (ES6+), HTML5, and CSS3 with CSS variables & responsive cyber-glass design system.
- **Persistence**: Browser `localStorage` for zero-friction client-side bookmarking and configuration persistence.
- **Portability**: 100% static asset architecture — deployable directly to Cloudflare Pages, GitHub Pages, Vercel, Netlify, or AWS S3 with zero backend servers required.

---

## 📜 License
MIT © [WhoVisions](https://github.com/WhoVisions)
