# AGENTS.md

## Project
This repository contains the hackathon project "My Address, My City" for the City of Montgomery, Alabama.

**Author:** Aicardo Barco Fajardo · abarcof@gmail.com

## Core product idea
Build a resident-friendly civic web app that turns one address or one clicked map location into a clear public-information snapshot.

The app should answer three questions:
1. What is true about this exact address?
2. What is closest to this address?
3. What is happening near this address?

## Primary challenge alignment
Primary: Civic Access & Community Communication
Secondary: Smart Cities / Infrastructure / Public Spaces
Optional tertiary fit: Public Safety / City Analytics

## Product principles
- Resident-facing, not GIS-analyst-facing
- English only across code, docs, labels, comments, prompts, and generated project text
- Address-first and map-first
- Read-only MVP
- Official Montgomery data over speculative logic
- Every phase must remain shippable
- Protect the core demo at all times
- A working prototype is more important than feature breadth

## Required modules
Module 1: This Address
- zoning
- flood context
- council district
- neighborhood / parcel summary
- official next steps

Module 2: What's Closest
- nearest civic resources from available validated datasets
- no complex scoring
- no advanced interpolation
- simple and explainable proximity logic only

Module 3: Nearby City Records (What's Happening Nearby)
- nearby code violations
- nearby building permits

Module 4: Finalist Package
- polished repo
- demo script
- pitch support
- claims validation
- commercialization section
- optional Bright Data enrichment

## Build phases
Phase 1:
- address search
- map click selection
- This Address module
- City Resources module
- fully shippable MVP

Phase 2:
- What's Closest module
- nearest civic resources
- improved summaries and UX polish

Phase 3:
- Nearby City Records module
- nearby code violations
- nearby building permits

Phase 4:
- finalist package
- repository polish
- demo polish
- app claims validation
- commercialization narrative
- optional Bright Data layer

## Scope restrictions
Do not introduce:
- authentication
- user accounts
- direct write-back to city systems
- ML-heavy scoring systems
- kriging
- dijkstra implementations
- predictive analytics
- complex backend architecture unless explicitly requested

## Data rules
Only use validated official or clearly documented sources.
If a source is uncertain, say so.
Do not invent fields, endpoints, or data behavior.

## Workflow rules
Before major implementation:
1. Restate the task briefly
2. Identify affected files
3. Propose the smallest viable implementation
4. Then implement

After implementation:
1. Summarize what changed
2. List remaining risks
3. State whether the current phase is still shippable
4. Suggest the next smallest step

## Quality bar
This project is being built to maximize hackathon scoring:
- Challenge fit
- Quality and design
- Originality and impact
- Commercialisation potential
- Bright Data bonus only if it does not risk the core app
