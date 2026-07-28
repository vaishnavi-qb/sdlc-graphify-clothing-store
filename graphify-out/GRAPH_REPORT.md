# Graph Report - .  (2026-07-29)

## Corpus Check
- Corpus is ~31,478 words - fits in a single context window. You may not need a graph.

## Summary
- 340 nodes · 510 edges · 27 communities (24 shown, 3 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 21 edges (avg confidence: 0.83)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Cart and Order Controllers
- React App Shell Pages
- Graphify Setup Exercise
- Frontend NPM Dependencies
- TDD Workflow and Ticket
- Backend NPM Dependencies
- Frontend Dev Tooling
- Mongo Models and Seed Data
- Server Middleware and Swagger
- Backend Package Scripts
- Token Optimization Steps
- User Auth Controllers
- Draft Tests Implement Flow
- Social SVG Icon Sprite
- Shopping Cart Icon
- Hero Marketing Image
- React Brand Logo
- Vite Brand Logo
- Frontend Product Data
- Exercise README Entry

## God Nodes (most connected - your core abstractions)
1. `api` - 9 edges
2. `Footer()` - 8 edges
3. `Navbar()` - 8 edges
4. `Ticket: Cart Item Selection for Checkout` - 8 edges
5. `asyncHandler()` - 7 edges
6. `Order` - 7 edges
7. `scripts` - 7 edges
8. `protect` - 6 edges
9. `Product` - 6 edges
10. `User` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Phase 1 draft failing tests only` --rationale_for--> `Ticket: Cart Item Selection for Checkout`  [INFERRED]
  AGENTS.md → ticket.md
- `Backend lives in ecommerce-backend` --conceptually_related_to--> `ecommerce-backend README`  [INFERRED]
  AGENTS.md → ecommerce-backend/README.md
- `.graphifyignore` --semantically_similar_to--> `.aiignore`  [INFERRED] [semantically similar]
  .github/steps/3-add-graphifyignore.md → .github/steps/token-optimization/8-exclude-noise.md
- `Validates context-engineering instructions in assistant files` --references--> `AGENTS.md agent workflow guide`  [EXTRACTED]
  .github/workflows/9-token-opt-context-engineering.yml → AGENTS.md
- `ticket.md as requirement source` --references--> `Ticket: Cart Item Selection for Checkout`  [EXTRACTED]
  AGENTS.md → ticket.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **AI SDLC Wave 1 Graphify setup** — github_steps_1_install_graphify_cli, github_steps_2_ai_assistant_integration, github_steps_3_add_graphifyignore, github_steps_4_build_first_graph, github_steps_1_install_graphify_cli_graphify [EXTRACTED 1.00]
- **Wave 2 test-first AI coding workflow** — github_steps_5_draft_tests, github_steps_6_implement_feature, github_steps_5_draft_tests_tdd, github_steps_6_implement_feature_frozen_tests [EXTRACTED 1.00]
- **Token optimization course track** — github_steps_token_optimization_8_exclude_noise, github_steps_token_optimization_9_context_engineering, github_steps_token_optimization_10_reading_guide, github_steps_token_optimization_8_exclude_noise_token_optimization [EXTRACTED 1.00]
- **Token optimization exercise step chain** — github_workflows_7_token_opt_start, github_workflows_8_token_opt_exclude_noise, github_workflows_9_token_opt_context_engineering [EXTRACTED 1.00]
- **Cart selection drives checkout totals** — ticket_checkbox_cart_selection, ticket_select_all_control, ticket_selected_items_checkout_totals, ticket_selection_persistence [EXTRACTED 1.00]
- **Context-engineering instruction file targets** — github_workflows_9_token_opt_context_engineering_instructions_check, agents, claude [EXTRACTED 1.00]

## Communities (27 total, 3 thin omitted)

### Community 0 - "Cart and Order Controllers"
Cohesion: 0.07
Nodes (33): addToCart, clearCart, getCart, getOrCreateCart(), removeFromCart, updateCartItemQty, getMyOrders, getOrderById (+25 more)

### Community 1 - "React App Shell Pages"
Cohesion: 0.17
Nodes (18): App(), Footer(), Navbar(), Cart(), Checkout(), normalizeAddress(), stripePromise, Home() (+10 more)

### Community 2 - "Graphify Setup Exercise"
Cohesion: 0.09
Nodes (32): Step 1: Install Graphify CLI, AI SDLC, CLI_OK.md proof file, Graphify, Graphify CLI, Step 2: AI assistant integration, Graphify AI assistant integration, Claude Code (+24 more)

### Community 3 - "Frontend NPM Dependencies"
Cohesion: 0.07
Nodes (26): axios, dependencies, axios, lucide-react, react, react-dom, react-redux, react-router-dom (+18 more)

### Community 4 - "TDD Workflow and Ticket"
Cohesion: 0.11
Nodes (25): AGENTS.md agent workflow guide, Phase 1 draft failing tests only, Backend lives in ecommerce-backend, Frontend lives in ecommerce-frontend, Frozen test-only commit as contract, Phase 2 implement against frozen tests, ticket.md as requirement source, Two-step test-first feature workflow (+17 more)

### Community 5 - "Backend NPM Dependencies"
Cohesion: 0.08
Nodes (25): bcryptjs, colors, cookie-parser, cors, dotenv, express, jsonwebtoken, mongoose (+17 more)

### Community 6 - "Frontend Dev Tooling"
Cohesion: 0.10
Nodes (21): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, sass, @types/react (+13 more)

### Community 7 - "Mongo Models and Seed Data"
Cohesion: 0.17
Nodes (12): Order, orderSchema, Product, productSchema, reviewSchema, addressSchema, User, userSchema (+4 more)

### Community 8 - "Server Middleware and Swagger"
Cohesion: 0.17
Nodes (12): connectDB(), __dirname, options, swaggerSpec, errorHandler(), notFound(), router, router (+4 more)

### Community 9 - "Backend Package Scripts"
Cohesion: 0.12
Nodes (15): author, description, keywords, license, main, name, scripts, build (+7 more)

### Community 10 - "Token Optimization Steps"
Cohesion: 0.15
Nodes (15): CLAUDE.md graphify assistant rules, graphify-out knowledge graph, graphify query/path/explain commands, graphify update after code changes, Step 7 Start Token Optimization workflow, Enables 8-token-opt-exclude-noise.yml only, Manual recovery path after Step 6 handoff, Step 8 Exclude noise workflow (+7 more)

### Community 11 - "User Auth Controllers"
Cohesion: 0.23
Nodes (7): addAddress, authUser, deleteAddress, getAddress, logoutUser, registerUser, router

### Community 12 - "Draft Tests Implement Flow"
Cohesion: 0.29
Nodes (11): Step 5: Draft failing tests, AGENTS.md draft-tests workflow, Cart checkbox selection feature, RED phase, Test-Driven Development, Step 6: Implement from frozen tests, Frozen tests, GREEN phase (+3 more)

### Community 13 - "Social SVG Icon Sprite"
Cohesion: 0.53
Nodes (6): SVG icon sprite sheet (social + docs symbols), Dual style: #08060d fills vs #aa3bff strokes, Purpose: footer/nav social and docs link glyphs, Filled brand marks: Bluesky, Discord, GitHub, X, Reusable SVG <symbol> sprite pattern, Purple stroke UI icons: documentation and social/user

### Community 14 - "Shopping Cart Icon"
Cohesion: 0.40
Nodes (5): Cart basket with handle, Ecommerce cart UI affordance, Black filled shopping cart silhouette, Shopping cart SVG icon, Two cart wheels

### Community 15 - "Hero Marketing Image"
Cohesion: 0.40
Nodes (5): Dark minimal aesthetic with violet energy accent, Hero PNG — abstract isometric layered slabs on black, Isometric stack: wireframe top slab over glowing purple base, Layering / structure visual metaphor, Marketing / hero background asset

### Community 16 - "React Brand Logo"
Cohesion: 0.50
Nodes (5): Atomic orbital emblem design, Cyan fill color #00D8FF, React JavaScript library, React brand logo mark, React logo SVG asset

## Ambiguous Edges - Review These
- `ecommerce-frontend README (GitLab template)` → `ecommerce frontend HTML shell`  [AMBIGUOUS]
  ecommerce-frontend/README.md · relation: conceptually_related_to

## Knowledge Gaps
- **101 isolated node(s):** `__dirname`, `options`, `SHIPPING_RATES`, `VALID_CATEGORIES`, `VALID_SORT` (+96 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `ecommerce-frontend README (GitLab template)` and `ecommerce frontend HTML shell`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `devDependencies` connect `Frontend Dev Tooling` to `Frontend NPM Dependencies`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Backend NPM Dependencies` to `Backend Package Scripts`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **What connects `__dirname`, `options`, `SHIPPING_RATES` to the rest of the system?**
  _101 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Cart and Order Controllers` be split into smaller, more focused modules?**
  _Cohesion score 0.07039187227866474 - nodes in this community are weakly interconnected._
- **Should `Graphify Setup Exercise` be split into smaller, more focused modules?**
  _Cohesion score 0.0907258064516129 - nodes in this community are weakly interconnected._
- **Should `Frontend NPM Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.07407407407407407 - nodes in this community are weakly interconnected._