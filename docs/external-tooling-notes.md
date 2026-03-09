# External Tooling Notes
## My Address, My City

This document summarizes external resources that may be relevant to the project. None of these are Phase 1 dependencies.

---

## A. Montgomery Developer Settings Page

**URL:** https://data.montgomeryal.gov/profile/edit/developer_settings

### What it is

This appears to be an account-level developer configuration page on Montgomery's data portal (`data.montgomeryal.gov`). It likely provides access to API credentials, developer tokens, or app registration for authenticated access to city data APIs.

### Relevance to this project

- **Phase 1:** Not a dependency. The core Phase 1 data sources are on `gis.montgomeryal.gov` (the ArcGIS REST server), not `data.montgomeryal.gov`. Phase 1 uses only public, unauthenticated endpoints.
- **If authenticated access is needed:** If during validation we discover that ArcGIS endpoints require an API token or that the open data portal's Hub API requires authentication, this page may become relevant. In that case, creating a developer account and generating credentials would become a pre-implementation step.
- **Phase 3+:** If Phase 3 datasets (code violations, building permits) on the open data portal require authenticated API access, developer settings may be needed.

### Decision

Do not treat this as a core dependency unless a real need emerges during validation. If endpoints work without authentication, this page is irrelevant to the MVP.

---

## B. Bright Data Hack Pack

**URL:** https://github.com/ScrapeAlchemist/brightdata-hack-pack

### What it is

A hackathon-oriented starter kit for building with Bright Data APIs. It provides code examples, MCP (Model Context Protocol) agent configuration, agentic workflows, documentation, and starter templates for integrating Bright Data into hackathon projects.

### Key components

**Quick-start setup:**
- Requires Node.js and an active Bright Data account (new users get free testing credits)
- API key obtained from Bright Data user settings
- Configuration via environment variables (`API_TOKEN`, `WEB_UNLOCKER_ZONE`, `BROWSER_AUTH`)

**API key and zones concept:**
- Bright Data organizes access through "zones" — named configurations for different products
- A zone named `mcp_unlocker` is the default for the MCP Web Unlocker
- An optional Scraping Browser zone enables browser automation
- Zones are managed in the Bright Data control panel

**MCP setup:**
- Bright Data provides an MCP server (`@brightdata/mcp`) that can be integrated into AI-assisted development environments (Claude Desktop, Cursor, etc.)
- Configuration example:
  ```json
  {
    "mcpServers": {
      "Bright Data": {
        "command": "npx",
        "args": ["@brightdata/mcp"],
        "env": {
          "API_TOKEN": "<your-token>",
          "WEB_UNLOCKER_ZONE": "mcp_unlocker"
        }
      }
    }
  }
  ```
- Provides tools like `scrape_as_html`, `scrape_as_markdown`, `search_engine`, and platform-specific structured data extractors

**Examples and starter templates:**
- Web scraping examples (HTML/Markdown extraction)
- Search engine result scraping
- Structured data extraction for major platforms
- Browser automation for complex scraping scenarios
- Related official templates at `github.com/luminati-io/bright-data-quickstart-templates`

**Hackathon usefulness:**
- Free testing credits lower the barrier to entry
- MCP integration means AI agents can use Bright Data tools directly
- Pre-built extractors reduce boilerplate code
- Search engine scraping can pull recent public context for any topic

### Recommended use by phase

| Phase | Recommendation |
|---|---|
| **Phase 0 / Preparation** | Useful as reference material. Read the MCP setup docs. Optionally set up a Bright Data account to have credentials ready. Do not integrate yet. |
| **Phase 1** | **Not a core dependency.** Phase 1 uses only Montgomery ArcGIS data. Bright Data is not involved. |
| **Phase 2–3** | **Still optional, not required.** Phases 2 and 3 use city data only (parks, POIs, code violations, permits). Bright Data is not needed for these. |
| **Phase 4** | **Best fit.** This is the natural integration point. Bright Data can power the optional "Recent Official Context" bonus module — pulling recent public web content, news, or official notices related to a Montgomery address or area. This is the only place Bright Data adds value without risking the core app. |
| **Agent-assisted research** | Bright Data's MCP tools may be useful for the development team to research Montgomery data sources, test URLs, or gather context during planning. However, any data gathered this way is for development reference only — it must not be presented as "official city data" in the app. |

### Important constraints

- The core app must work 100% without Bright Data. If the Bright Data bonus layer fails or is removed, the submission must remain fully functional.
- Any content sourced from Bright Data must be clearly labeled in the UI as "web-sourced context" and never presented as official city data.
- Bright Data integration should only be attempted after Phases 1–3 are stable and the core submission is safe.
- If integrating Bright Data would risk missing the deadline, skip it.
