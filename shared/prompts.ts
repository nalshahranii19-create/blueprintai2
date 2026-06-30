/**
 * Advanced Prompt Engineering for Blueprint AI
 * Each section has a dedicated, deeply personalized prompt
 */

export interface BlueprintContext {
  projectIdea: string;
  projectType: string;
  targetAudience: string;
  coreFeatures: string;
  language: "en" | "ar";
  industry?: string;
  budget?: string;
  teamSize?: string;
  timeline?: string;
  revenueModel?: string;
}

export interface SectionDefinition {
  key: string;
  title: string;
  titleAr: string;
  emoji: string;
  prompt: (ctx: BlueprintContext) => string;
}

const contextBlock = (ctx: BlueprintContext) => `
PROJECT CONTEXT:
- Idea: ${ctx.projectIdea}
- Type: ${ctx.projectType}
- Target Audience: ${ctx.targetAudience}
- Core Features: ${ctx.coreFeatures}
${ctx.industry ? `- Industry: ${ctx.industry}` : ""}
${ctx.budget ? `- Budget: ${ctx.budget}` : ""}
${ctx.teamSize ? `- Team Size: ${ctx.teamSize}` : ""}
${ctx.timeline ? `- Timeline: ${ctx.timeline}` : ""}
${ctx.revenueModel ? `- Revenue Model: ${ctx.revenueModel}` : ""}
`;

export const BLUEPRINT_SECTIONS: SectionDefinition[] = [
  {
    key: "business_analysis",
    title: "1. Business Analysis",
    titleAr: "١. تحليل الأعمال",
    emoji: "📊",
    prompt: (ctx) => `
You are an elite business analyst and startup consultant. Provide a comprehensive business analysis for this project.

${contextBlock(ctx)}

Write a detailed business analysis covering:
1. **Executive Summary** - A compelling 3-sentence overview of the business opportunity
2. **Problem Statement** - The specific pain points this project solves, with real-world examples
3. **Solution Overview** - How this project uniquely addresses the problem
4. **Market Opportunity** - Total Addressable Market (TAM), Serviceable Addressable Market (SAM), and Serviceable Obtainable Market (SOM) with realistic estimates
5. **Value Proposition** - The unique value this delivers to ${ctx.targetAudience}
6. **Competitive Advantage** - What makes this defensible and hard to copy
7. **Business Viability** - Key factors that make this business viable or risky

Be specific, data-driven where possible, and tailor every point to "${ctx.projectIdea}". Avoid generic statements.
${ctx.language === "ar" ? "Write the entire response in Arabic." : "Write in English."}
`,
  },
  {
    key: "project_goals",
    title: "2. Project Goals",
    titleAr: "٢. أهداف المشروع",
    emoji: "🎯",
    prompt: (ctx) => `
You are a strategic product manager. Define clear, measurable goals for this project.

${contextBlock(ctx)}

Define comprehensive project goals:
1. **Vision Statement** - The long-term aspirational goal (5-10 years)
2. **Mission Statement** - The day-to-day purpose and how it serves users
3. **Short-term Goals (0-6 months)** - 5 specific, measurable goals with KPIs
4. **Medium-term Goals (6-18 months)** - 5 growth and expansion goals
5. **Long-term Goals (18+ months)** - 5 strategic objectives
6. **Success Metrics** - Specific KPIs: DAU/MAU, revenue targets, NPS score, churn rate
7. **North Star Metric** - The single most important metric for this business

Make all goals SMART (Specific, Measurable, Achievable, Relevant, Time-bound) and specific to "${ctx.projectIdea}".
${ctx.language === "ar" ? "Write the entire response in Arabic." : "Write in English."}
`,
  },
  {
    key: "target_users",
    title: "3. Target Users",
    titleAr: "٣. المستخدمون المستهدفون",
    emoji: "👥",
    prompt: (ctx) => `
You are a UX researcher and customer development expert. Define the target user personas in depth.

${contextBlock(ctx)}

Create detailed user personas and segmentation:
1. **Primary Persona** - Full profile: name, age, job, income, goals, frustrations, tech-savviness
2. **Secondary Persona** - A different segment with different needs
3. **User Segmentation** - Break down ${ctx.targetAudience} into 3-4 distinct segments
4. **User Psychology** - What motivates them, what they fear, what they value
5. **Jobs-to-be-Done** - The functional, emotional, and social jobs users hire this product for
6. **User Journey Emotions** - How users feel at each stage (awareness → consideration → purchase → use → advocacy)
7. **Willingness to Pay** - Price sensitivity analysis for each segment
8. **Where to Find Them** - Specific channels, communities, platforms where these users congregate

Be extremely specific to "${ctx.projectIdea}" and "${ctx.targetAudience}".
${ctx.language === "ar" ? "Write the entire response in Arabic." : "Write in English."}
`,
  },
  {
    key: "core_features",
    title: "4. Core Features",
    titleAr: "٤. الميزات الأساسية",
    emoji: "⚡",
    prompt: (ctx) => `
You are a senior product manager with expertise in feature prioritization. Define the complete feature set.

${contextBlock(ctx)}

Define a comprehensive feature breakdown:
1. **MVP Features (Must-Have)** - The minimum set to launch and validate, based on: ${ctx.coreFeatures}
2. **Core Features (Should-Have)** - Features that significantly improve the product
3. **Feature Specifications** - For each MVP feature: user story, acceptance criteria, complexity (S/M/L)
4. **Feature Priority Matrix** - Impact vs. Effort matrix for all features
5. **Feature Dependencies** - Which features must be built before others
6. **User-Facing vs. Backend Features** - Clear separation
7. **Accessibility Features** - Ensure inclusivity
8. **Mobile vs. Desktop Priority** - Which features matter most on each platform

Focus on features that directly serve "${ctx.targetAudience}" and solve the core problem.
${ctx.language === "ar" ? "Write the entire response in Arabic." : "Write in English."}
`,
  },
  {
    key: "premium_features",
    title: "5. Premium & Future Features",
    titleAr: "٥. الميزات المميزة والمستقبلية",
    emoji: "💎",
    prompt: (ctx) => `
You are a product strategist focused on growth and monetization. Define the premium feature roadmap.

${contextBlock(ctx)}

Define premium and future features:
1. **Premium Tier Features** - Features worth paying for, with justification for each
2. **AI/ML Enhancement Opportunities** - Specific AI features that would dramatically improve this product
3. **Integration Ecosystem** - Third-party integrations that would add significant value
4. **Platform Expansion** - Mobile app, browser extension, API, white-label opportunities
5. **Community Features** - Social, collaboration, or network-effect features
6. **Enterprise Features** - Features for larger clients (SSO, audit logs, team management)
7. **Future Innovation** - Emerging tech (AR/VR, voice, blockchain) that could apply in 3-5 years
8. **Feature Monetization** - Which features to put behind which pricing tier

Tie every feature back to real user needs for "${ctx.projectIdea}".
${ctx.language === "ar" ? "Write the entire response in Arabic." : "Write in English."}
`,
  },
  {
    key: "user_journey",
    title: "6. Complete User Journey",
    titleAr: "٦. رحلة المستخدم الكاملة",
    emoji: "🗺️",
    prompt: (ctx) => `
You are a UX designer and customer experience expert. Map the complete user journey.

${contextBlock(ctx)}

Map the complete user journey with emotional states:
1. **Awareness Stage** - How users discover the product (channels, triggers, first impressions)
2. **Consideration Stage** - What users evaluate before signing up (trust signals, comparisons)
3. **Onboarding Journey** - Step-by-step first-time user experience (first 5 minutes matter most)
4. **Activation Moment** - The "aha moment" when users realize the value
5. **Core Usage Loop** - The habitual usage pattern (trigger → action → reward → investment)
6. **Power User Journey** - How casual users become power users
7. **Sharing & Referral Journey** - What triggers users to share or refer
8. **Churn Prevention Journey** - Warning signs and intervention points
9. **Win-Back Journey** - How to re-engage churned users
10. **Touchpoint Map** - All interaction points with emotional scores (-2 to +2)

Make this specific to how "${ctx.targetAudience}" would actually use "${ctx.projectIdea}".
${ctx.language === "ar" ? "Write the entire response in Arabic." : "Write in English."}
`,
  },
  {
    key: "pages_screens",
    title: "7. All Pages & Screens",
    titleAr: "٧. جميع الصفحات والشاشات",
    emoji: "📱",
    prompt: (ctx) => `
You are a senior UI/UX architect. Define every page and screen needed for this product.

${contextBlock(ctx)}

Define all pages and screens with detailed descriptions:
For each page provide: Purpose, Key Components, User Actions, Success State, Empty State, Error State

**Public Pages:**
1. Landing Page - Hero, features, social proof, pricing, CTA
2. About/Story Page
3. Pricing Page
4. Blog/Content Hub
5. Legal Pages (Privacy, Terms)

**Auth Flow:**
6. Sign Up (with social options)
7. Sign In
8. Password Reset
9. Email Verification

**Core App Pages (based on ${ctx.coreFeatures}):**
10-20. Define all core feature pages specific to this product

**Dashboard & Account:**
21. Main Dashboard - Key metrics, recent activity, quick actions
22. User Profile & Settings
23. Billing & Subscription
24. Notifications Center
25. Help & Support

For each page, describe the layout, key interactions, and what makes it excellent UX.
${ctx.language === "ar" ? "Write the entire response in Arabic." : "Write in English."}
`,
  },
  {
    key: "dashboard_layout",
    title: "8. Dashboard Layout",
    titleAr: "٨. تصميم لوحة التحكم",
    emoji: "🖥️",
    prompt: (ctx) => `
You are a dashboard design expert. Design the optimal dashboard for this product.

${contextBlock(ctx)}

Design a comprehensive dashboard:
1. **Dashboard Philosophy** - What information hierarchy matters most for ${ctx.targetAudience}
2. **Navigation Structure** - Sidebar vs. top nav, primary vs. secondary navigation items
3. **Key Metrics Cards** - The 4-6 most important KPIs to display prominently
4. **Main Content Area** - Primary workspace layout and interaction patterns
5. **Data Visualization** - Charts, graphs, and visual elements needed
6. **Quick Actions** - The most frequent actions that need one-click access
7. **Notification System** - How to surface alerts, updates, and recommendations
8. **Responsive Behavior** - How the dashboard adapts to mobile/tablet
9. **Personalization** - How users can customize their dashboard view
10. **Empty States** - What new users see before they have data
11. **Loading States** - Skeleton screens and progressive loading
12. **Accessibility** - Keyboard navigation, screen reader support, color contrast

Design this specifically for how "${ctx.targetAudience}" will use the dashboard daily.
${ctx.language === "ar" ? "Write the entire response in Arabic." : "Write in English."}
`,
  },
  {
    key: "database_design",
    title: "9. Database Design",
    titleAr: "٩. تصميم قاعدة البيانات",
    emoji: "🗄️",
    prompt: (ctx) => `
You are a senior database architect. Design a production-ready database schema.

${contextBlock(ctx)}

Design a complete database schema:
1. **Database Choice & Justification** - SQL vs. NoSQL, specific database recommendation with reasons
2. **Core Tables** - Every table needed with all columns, types, constraints, and indexes
3. **Relationships** - ERD description, foreign keys, join tables for many-to-many
4. **Indexing Strategy** - Which columns to index and why (query patterns)
5. **Data Types** - Specific data type choices with justification
6. **Soft Deletes** - Which tables need soft delete and why
7. **Audit Trail** - Tables that need created_at, updated_at, created_by
8. **Partitioning Strategy** - For high-volume tables
9. **Caching Layer** - What to cache in Redis/Memcached
10. **Search Strategy** - Full-text search requirements and implementation
11. **Data Migration Plan** - How to handle schema changes in production
12. **Backup Strategy** - Frequency, retention, recovery time objective

Design for scale: assume 1M users and 100M records.
${ctx.language === "ar" ? "Write the entire response in Arabic." : "Write in English."}
`,
  },
  {
    key: "api_architecture",
    title: "10. API Architecture",
    titleAr: "١٠. معمارية الـ API",
    emoji: "🔌",
    prompt: (ctx) => `
You are a senior backend architect. Design a production-grade API architecture.

${contextBlock(ctx)}

Design a comprehensive API architecture:
1. **API Style** - REST vs. GraphQL vs. tRPC with justification for this specific project
2. **Authentication** - JWT, OAuth2, API keys - which and why
3. **Core Endpoints** - All endpoints with method, path, request/response schema
4. **API Versioning** - Strategy for backward compatibility
5. **Rate Limiting** - Limits per endpoint, per user, per IP
6. **Error Handling** - Standard error codes, error response format
7. **Pagination** - Cursor vs. offset pagination, when to use each
8. **Filtering & Sorting** - Query parameter conventions
9. **Webhooks** - Events that should trigger webhooks, payload format
10. **Real-time** - WebSocket or SSE requirements
11. **File Upload** - Multipart upload strategy, size limits
12. **API Documentation** - OpenAPI/Swagger specification approach
13. **API Gateway** - Rate limiting, caching, logging at the gateway level

Design for "${ctx.projectType}" with specific endpoints for all features in: ${ctx.coreFeatures}
${ctx.language === "ar" ? "Write the entire response in Arabic." : "Write in English."}
`,
  },
  {
    key: "auth_permissions",
    title: "11. Authentication & Permissions",
    titleAr: "١١. المصادقة والصلاحيات",
    emoji: "🔐",
    prompt: (ctx) => `
You are a security architect specializing in authentication systems. Design the auth and permissions system.

${contextBlock(ctx)}

Design a comprehensive auth and permissions system:
1. **Authentication Methods** - Email/password, social login (Google, GitHub, Apple), magic links, SSO
2. **Session Management** - JWT vs. sessions, token expiry, refresh token strategy
3. **Role-Based Access Control (RBAC)** - Define all roles and their permissions
4. **Permission Matrix** - Table of roles vs. resources vs. actions (CRUD)
5. **Multi-tenancy** - If applicable, how to isolate data between organizations
6. **2FA/MFA** - Implementation approach and when to require it
7. **OAuth2 Integration** - Scopes, consent flows, token management
8. **API Key Management** - For developer/enterprise access
9. **Account Security** - Brute force protection, suspicious activity detection
10. **Password Policy** - Requirements, hashing algorithm (bcrypt/argon2)
11. **Audit Logging** - What auth events to log and why
12. **GDPR Compliance** - Right to deletion, data portability, consent management

Design for "${ctx.projectType}" with ${ctx.targetAudience} in mind.
${ctx.language === "ar" ? "Write the entire response in Arabic." : "Write in English."}
`,
  },
  {
    key: "tech_stack",
    title: "12. Tech Stack",
    titleAr: "١٢. التقنيات المستخدمة",
    emoji: "🛠️",
    prompt: (ctx) => `
You are a CTO and technical architect. Recommend the optimal tech stack with detailed justification.

${contextBlock(ctx)}

Recommend a complete tech stack:
1. **Frontend** - Framework, state management, UI library, styling - with specific versions and reasons
2. **Backend** - Runtime, framework, ORM - with specific reasons for this project type
3. **Database** - Primary DB, cache, search engine - with justification
4. **Infrastructure** - Cloud provider, containerization, orchestration
5. **AI/ML Stack** - If applicable, specific models, APIs, and frameworks
6. **Authentication** - Specific auth service or library
7. **File Storage** - CDN, object storage solution
8. **Email Service** - Transactional email provider
9. **Payment Processing** - Payment gateway recommendation
10. **Analytics** - Product analytics, error tracking, performance monitoring
11. **CI/CD** - Pipeline tools and deployment strategy
12. **Testing** - Unit, integration, E2E testing tools
13. **Build Tools** - Bundler, transpiler, linter configuration
14. **Cost Estimate** - Monthly infrastructure cost at 1K, 10K, 100K users

Justify every choice specifically for "${ctx.projectType}" with ${ctx.teamSize ? `a team of ${ctx.teamSize}` : "a small team"} and ${ctx.budget ? `budget of ${ctx.budget}` : "limited budget"}.
${ctx.language === "ar" ? "Write the entire response in Arabic." : "Write in English."}
`,
  },
  {
    key: "folder_structure",
    title: "13. Folder & File Structure",
    titleAr: "١٣. هيكل المجلدات والملفات",
    emoji: "📁",
    prompt: (ctx) => `
You are a senior software architect. Define the complete project structure.

${contextBlock(ctx)}

Define the complete folder and file structure:
1. **Monorepo vs. Multi-repo** - Recommendation with justification
2. **Frontend Structure** - Complete directory tree with explanation of each folder
3. **Backend Structure** - Complete directory tree with explanation of each folder
4. **Shared Code** - What to share between frontend and backend
5. **Configuration Files** - All config files needed (.env, tsconfig, eslint, etc.)
6. **Testing Structure** - Where tests live relative to source code
7. **Documentation Structure** - Where docs, ADRs, and API specs live
8. **CI/CD Configuration** - Pipeline configuration files
9. **Docker Structure** - Dockerfile, docker-compose layout
10. **Naming Conventions** - File naming, component naming, API naming standards

Show the actual tree structure with comments explaining each directory.
${ctx.language === "ar" ? "Write the entire response in Arabic." : "Write in English."}
`,
  },
  {
    key: "ui_ux",
    title: "14. UI/UX Recommendations",
    titleAr: "١٤. توصيات تجربة المستخدم",
    emoji: "🎨",
    prompt: (ctx) => `
You are a world-class UI/UX designer. Provide comprehensive design recommendations.

${contextBlock(ctx)}

Provide detailed UI/UX recommendations:
1. **Design Philosophy** - The overall design language and principles for this product
2. **Color System** - Primary, secondary, accent, semantic colors with hex values and rationale
3. **Typography** - Font choices, scale, line heights for readability
4. **Spacing System** - 4px or 8px grid, spacing scale
5. **Component Library** - Key components needed, design patterns
6. **Interaction Design** - Micro-interactions, animations, transitions (with timing)
7. **Information Architecture** - How to organize and present information
8. **Cognitive Load Reduction** - How to make the product feel simple
9. **Onboarding UX** - Progressive disclosure, tooltips, empty states
10. **Error UX** - How to handle and communicate errors gracefully
11. **Mobile-First Considerations** - Touch targets, gestures, thumb zones
12. **Accessibility (WCAG 2.1 AA)** - Specific requirements for this product
13. **Dark Mode** - Whether to support it and implementation approach
14. **Localization** - RTL support, internationalization considerations

Tailor all recommendations to "${ctx.targetAudience}" and "${ctx.projectType}".
${ctx.language === "ar" ? "Write the entire response in Arabic." : "Write in English."}
`,
  },
  {
    key: "security",
    title: "15. Security Considerations",
    titleAr: "١٥. اعتبارات الأمان",
    emoji: "🛡️",
    prompt: (ctx) => `
You are a cybersecurity expert and application security architect. Define the security strategy.

${contextBlock(ctx)}

Define a comprehensive security strategy:
1. **Threat Model** - Top 5 threats specific to this type of application
2. **OWASP Top 10** - How to address each relevant vulnerability for this project
3. **Data Encryption** - At-rest and in-transit encryption strategy
4. **Input Validation** - Server-side validation, sanitization, parameterized queries
5. **XSS Prevention** - Content Security Policy, output encoding
6. **CSRF Protection** - Token-based protection strategy
7. **SQL Injection Prevention** - ORM usage, prepared statements
8. **Secrets Management** - Environment variables, vault, key rotation
9. **Dependency Security** - Vulnerability scanning, update strategy
10. **Infrastructure Security** - Network policies, firewall rules, VPC setup
11. **Incident Response Plan** - What to do when a breach occurs
12. **Security Testing** - SAST, DAST, penetration testing schedule
13. **Compliance Requirements** - GDPR, SOC2, HIPAA (if applicable)
14. **Security Headers** - Complete HTTP security headers configuration

Focus on threats most relevant to "${ctx.projectType}" handling ${ctx.targetAudience} data.
${ctx.language === "ar" ? "Write the entire response in Arabic." : "Write in English."}
`,
  },
  {
    key: "performance",
    title: "16. Performance Optimization",
    titleAr: "١٦. تحسين الأداء",
    emoji: "⚡",
    prompt: (ctx) => `
You are a performance engineering expert. Define the performance optimization strategy.

${contextBlock(ctx)}

Define a comprehensive performance strategy:
1. **Performance Budget** - Target metrics: LCP < 2.5s, FID < 100ms, CLS < 0.1
2. **Frontend Performance** - Code splitting, lazy loading, bundle optimization
3. **Image Optimization** - WebP, lazy loading, responsive images, CDN
4. **Caching Strategy** - Browser cache, CDN cache, API cache, database query cache
5. **Database Performance** - Query optimization, N+1 prevention, connection pooling
6. **API Performance** - Response compression, pagination, field selection
7. **Server-Side Rendering** - When to use SSR vs. CSR vs. SSG
8. **CDN Strategy** - What to serve from CDN, cache invalidation
9. **Real User Monitoring** - Performance metrics to track in production
10. **Load Testing** - Tools and benchmarks to validate before launch
11. **Scalability Bottlenecks** - Identify and address before they become problems
12. **Mobile Performance** - Network-aware loading, offline support

Target performance for "${ctx.targetAudience}" considering their likely devices and connection speeds.
${ctx.language === "ar" ? "Write the entire response in Arabic." : "Write in English."}
`,
  },
  {
    key: "seo_strategy",
    title: "17. SEO Strategy",
    titleAr: "١٧. استراتيجية تحسين محركات البحث",
    emoji: "🔍",
    prompt: (ctx) => `
You are an SEO expert and content strategist. Define a comprehensive SEO strategy.

${contextBlock(ctx)}

Define a complete SEO strategy:
1. **Keyword Strategy** - Primary, secondary, and long-tail keywords for "${ctx.projectIdea}"
2. **Content Architecture** - Site structure, URL hierarchy, internal linking
3. **Technical SEO** - Sitemap, robots.txt, canonical tags, structured data
4. **On-Page SEO** - Title tags, meta descriptions, heading hierarchy
5. **Content Marketing Plan** - Blog topics, content calendar, pillar pages
6. **Link Building Strategy** - Tactics to earn high-quality backlinks
7. **Local SEO** - If applicable, Google My Business, local citations
8. **Schema Markup** - Specific schema types for this product type
9. **Core Web Vitals** - Performance metrics that affect ranking
10. **Mobile SEO** - Mobile-first indexing considerations
11. **International SEO** - hreflang tags, multilingual content strategy
12. **SEO Metrics** - KPIs to track: organic traffic, keyword rankings, CTR
13. **Competitor SEO Analysis** - What competitors rank for and gaps to exploit

Focus on keywords and content that would attract "${ctx.targetAudience}" searching for solutions like "${ctx.projectIdea}".
${ctx.language === "ar" ? "Write the entire response in Arabic." : "Write in English."}
`,
  },
  {
    key: "ai_features",
    title: "18. AI Features",
    titleAr: "١٨. ميزات الذكاء الاصطناعي",
    emoji: "🤖",
    prompt: (ctx) => `
You are an AI product strategist and ML engineer. Define AI features that would transform this product.

${contextBlock(ctx)}

Define AI features and implementation strategy:
1. **Core AI Opportunities** - The 3 highest-impact AI features for "${ctx.projectIdea}"
2. **Personalization Engine** - How AI can personalize the experience for each user
3. **Predictive Features** - What user behaviors or outcomes can be predicted
4. **Natural Language Processing** - Search, commands, content generation opportunities
5. **Computer Vision** - If applicable, image/video analysis features
6. **Recommendation System** - What to recommend to users and when
7. **Automation Opportunities** - Repetitive tasks AI can automate
8. **AI-Powered Analytics** - Insights and anomaly detection
9. **Conversational AI** - Chatbot or AI assistant use cases
10. **Content Generation** - AI-generated content that adds value
11. **AI Model Selection** - Which models (GPT-4, Claude, Gemini) for which tasks
12. **AI Cost Management** - How to optimize AI API costs at scale
13. **AI Ethics** - Bias, fairness, transparency considerations
14. **AI Competitive Moat** - How AI creates defensible advantage

Focus on AI features that would genuinely delight "${ctx.targetAudience}" and create switching costs.
${ctx.language === "ar" ? "Write the entire response in Arabic." : "Write in English."}
`,
  },
  {
    key: "integrations",
    title: "19. Third-Party Integrations",
    titleAr: "١٩. التكاملات مع الأطراف الثالثة",
    emoji: "🔗",
    prompt: (ctx) => `
You are a solutions architect specializing in SaaS integrations. Define the integration ecosystem.

${contextBlock(ctx)}

Define a comprehensive integration strategy:
1. **Essential Integrations** - Must-have integrations for launch
2. **Payment Processing** - Stripe, PayPal, regional options - recommendation with reasons
3. **Email Marketing** - Mailchimp, SendGrid, Postmark - for transactional and marketing
4. **Analytics Stack** - Mixpanel, Amplitude, Segment - product analytics
5. **Customer Support** - Intercom, Zendesk, Crisp - support tooling
6. **CRM Integration** - HubSpot, Salesforce - for B2B sales
7. **Productivity Tools** - Slack, Teams, Notion, Zapier, Make
8. **Social Login** - Google, GitHub, LinkedIn, Apple
9. **Storage & CDN** - AWS S3, Cloudflare, Bunny.net
10. **Monitoring & Logging** - Datadog, Sentry, LogRocket
11. **Communication** - Twilio, SendGrid, push notifications
12. **Marketplace/App Store** - Zapier, Slack App Directory, Chrome Extension
13. **Webhook Strategy** - Events to expose to third-party integrations
14. **Integration Priority** - Which integrations to build first and why

Prioritize integrations that ${ctx.targetAudience} already use daily.
${ctx.language === "ar" ? "Write the entire response in Arabic." : "Write in English."}
`,
  },
  {
    key: "deployment_plan",
    title: "20. Deployment Plan",
    titleAr: "٢٠. خطة النشر",
    emoji: "🚀",
    prompt: (ctx) => `
You are a DevOps engineer and cloud architect. Define the deployment strategy.

${contextBlock(ctx)}

Define a comprehensive deployment plan:
1. **Environment Strategy** - Development, staging, production environments
2. **Cloud Provider** - AWS vs. GCP vs. Azure vs. Vercel/Railway - recommendation with reasons
3. **Containerization** - Docker setup, image optimization
4. **Orchestration** - Kubernetes vs. managed services (ECS, Cloud Run)
5. **CI/CD Pipeline** - GitHub Actions, GitLab CI - complete pipeline stages
6. **Infrastructure as Code** - Terraform, Pulumi, CDK approach
7. **Database Deployment** - Managed DB service, connection pooling, read replicas
8. **Zero-Downtime Deployments** - Blue-green, canary, rolling deployments
9. **Rollback Strategy** - How to quickly revert bad deployments
10. **Environment Variables** - Secrets management in production
11. **SSL/TLS** - Certificate management, HTTPS everywhere
12. **Domain & DNS** - Setup, CDN integration, failover
13. **Monitoring & Alerting** - What to monitor, alert thresholds
14. **Disaster Recovery** - RTO/RPO targets, backup strategy

Design for ${ctx.budget ? `budget of ${ctx.budget}` : "cost-efficiency"} with ${ctx.teamSize ? `team of ${ctx.teamSize}` : "small team"}.
${ctx.language === "ar" ? "Write the entire response in Arabic." : "Write in English."}
`,
  },
  {
    key: "scalability",
    title: "21. Scalability Plan",
    titleAr: "٢١. خطة التوسع",
    emoji: "📈",
    prompt: (ctx) => `
You are a systems architect specializing in high-scale systems. Define the scalability roadmap.

${contextBlock(ctx)}

Define a comprehensive scalability plan:
1. **Scalability Tiers** - Architecture at 100, 10K, 100K, 1M users
2. **Horizontal vs. Vertical Scaling** - When to use each approach
3. **Database Scaling** - Read replicas, sharding, connection pooling strategy
4. **Caching Architecture** - Redis cluster, cache invalidation, cache warming
5. **Message Queue** - When to introduce async processing (RabbitMQ, SQS, Kafka)
6. **Microservices Migration** - When and how to break the monolith
7. **CDN & Edge Computing** - Content delivery and edge function opportunities
8. **Auto-scaling** - Rules and triggers for automatic scaling
9. **Performance Bottlenecks** - Predicted bottlenecks and mitigation strategies
10. **Cost Scaling** - How infrastructure costs scale with user growth
11. **Team Scaling** - How the engineering team needs to grow
12. **Multi-region** - When and how to expand to multiple regions
13. **Load Testing** - Benchmarks to hit before each scaling tier

Plan for "${ctx.projectType}" with realistic growth projections.
${ctx.language === "ar" ? "Write the entire response in Arabic." : "Write in English."}
`,
  },
  {
    key: "testing_strategy",
    title: "22. Testing Strategy",
    titleAr: "٢٢. استراتيجية الاختبار",
    emoji: "🧪",
    prompt: (ctx) => `
You are a QA architect and testing expert. Define the complete testing strategy.

${contextBlock(ctx)}

Define a comprehensive testing strategy:
1. **Testing Philosophy** - Testing pyramid approach for this specific project
2. **Unit Testing** - What to unit test, coverage targets, mocking strategy
3. **Integration Testing** - API testing, database testing approach
4. **End-to-End Testing** - Critical user journeys to automate
5. **Performance Testing** - Load testing, stress testing, soak testing
6. **Security Testing** - SAST, DAST, dependency scanning
7. **Accessibility Testing** - Automated and manual a11y testing
8. **Visual Regression Testing** - Screenshot comparison approach
9. **Mobile Testing** - Device coverage, emulation vs. real devices
10. **API Contract Testing** - Consumer-driven contract testing
11. **Chaos Engineering** - Resilience testing approach
12. **Test Data Management** - Fixtures, factories, test database strategy
13. **CI/CD Integration** - Which tests run at which pipeline stage
14. **Testing KPIs** - Coverage targets, flakiness thresholds, test execution time

Design testing for "${ctx.projectType}" with focus on the most critical user flows.
${ctx.language === "ar" ? "Write the entire response in Arabic." : "Write in English."}
`,
  },
  {
    key: "development_roadmap",
    title: "23. Development Roadmap",
    titleAr: "٢٣. خارطة طريق التطوير",
    emoji: "🗓️",
    prompt: (ctx) => `
You are a CTO and engineering manager. Create a detailed, realistic development roadmap.

${contextBlock(ctx)}

Create a comprehensive development roadmap:
1. **Phase 0: Foundation (Week 1-2)** - Project setup, architecture decisions, team alignment
2. **Phase 1: MVP (Week 3-8)** - Core features to validate the hypothesis
3. **Phase 2: Beta (Week 9-16)** - Polish, feedback integration, performance
4. **Phase 3: Launch (Week 17-20)** - Marketing site, onboarding, analytics
5. **Phase 4: Growth (Month 6-12)** - Premium features, integrations, scaling
6. **Phase 5: Scale (Year 2)** - Enterprise features, international expansion

For each phase include:
- Specific deliverables
- Team requirements
- Success criteria
- Dependencies
- Risks and mitigations

Also include:
7. **Sprint Planning** - 2-week sprint structure for the first 3 months
8. **Milestone Gates** - Decision points to continue, pivot, or stop
9. **Technical Debt Budget** - How much tech debt to accept at each phase
10. **Launch Checklist** - Everything needed before going live

${ctx.timeline ? `Target timeline: ${ctx.timeline}` : ""}
${ctx.teamSize ? `Team size: ${ctx.teamSize}` : ""}
${ctx.language === "ar" ? "Write the entire response in Arabic." : "Write in English."}
`,
  },
  {
    key: "risks_problems",
    title: "24. Risks & How to Avoid Them",
    titleAr: "٢٤. المخاطر وكيفية تجنبها",
    emoji: "⚠️",
    prompt: (ctx) => `
You are a risk management expert and startup advisor. Identify and mitigate all risks.

${contextBlock(ctx)}

Comprehensive risk analysis and mitigation:
1. **Market Risks** - Is there real demand? Competition? Market timing?
2. **Technical Risks** - Architecture decisions that could fail, scalability risks
3. **Team Risks** - Key person dependency, skill gaps, hiring challenges
4. **Financial Risks** - Runway, burn rate, revenue model validation
5. **Legal & Compliance Risks** - IP, data privacy, regulatory requirements
6. **Security Risks** - Data breaches, DDoS, account takeover
7. **Operational Risks** - Vendor lock-in, third-party dependencies
8. **Product Risks** - Wrong features, poor UX, low activation
9. **Growth Risks** - Acquisition costs, retention challenges, churn
10. **Competitive Risks** - Big tech entering the market, fast followers

For each risk provide:
- Probability (Low/Medium/High)
- Impact (Low/Medium/High)  
- Early warning signs
- Mitigation strategy
- Contingency plan

11. **Risk Priority Matrix** - Rank all risks by probability × impact
12. **Pre-mortem Exercise** - Imagine the project failed - what went wrong?

Be brutally honest about the specific risks for "${ctx.projectIdea}".
${ctx.language === "ar" ? "Write the entire response in Arabic." : "Write in English."}
`,
  },
  {
    key: "revenue_strategy",
    title: "25. Revenue & Growth Strategy",
    titleAr: "٢٥. استراتيجية الإيرادات والنمو",
    emoji: "💰",
    prompt: (ctx) => `
You are a growth hacker, revenue strategist, and business model expert. Define how to maximize revenue.

${contextBlock(ctx)}

Define a comprehensive revenue and growth strategy:

**Revenue Streams:**
1. **Primary Revenue Model** - Detailed breakdown of the main monetization approach
2. **Pricing Strategy** - Specific price points, tiers, and psychological pricing tactics
3. **Freemium vs. Free Trial** - Which model fits and why, conversion benchmarks
4. **Additional Revenue Streams** - Upsells, cross-sells, marketplace, data, advertising
5. **Enterprise Sales** - If applicable, enterprise pricing, procurement process

**Growth Strategy:**
6. **Acquisition Channels** - Top 3 channels ranked by CAC and scalability
7. **Viral Loops** - Product-led growth mechanisms built into the product
8. **Content Marketing** - SEO, thought leadership, community building
9. **Partnership Strategy** - Integration partners, distribution partners, co-marketing
10. **Paid Acquisition** - Google Ads, Facebook Ads, LinkedIn - budget allocation

**Retention & Expansion:**
11. **Retention Mechanics** - Features and habits that keep users coming back
12. **Net Revenue Retention** - How to expand revenue from existing customers
13. **Referral Program** - Design a referral program with specific incentives
14. **Community Building** - How to build a community around "${ctx.projectIdea}"

**Financial Projections:**
15. **Unit Economics** - LTV, CAC, payback period targets
16. **Revenue Milestones** - $1K, $10K, $100K MRR - what it takes to reach each

${ctx.revenueModel ? `Preferred revenue model: ${ctx.revenueModel}` : ""}
${ctx.language === "ar" ? "Write the entire response in Arabic." : "Write in English."}
`,
  },
];

/**
 * Detect if user inputs are too vague and generate follow-up questions
 */
export function detectWeakInputs(ctx: BlueprintContext): string[] {
  const questions: string[] = [];

  if (ctx.projectIdea.length < 50) {
    questions.push(
      ctx.language === "ar"
        ? "ما هي المشكلة المحددة التي يحلها مشروعك؟ كيف يختلف عن الحلول الموجودة؟"
        : "What specific problem does your project solve? How is it different from existing solutions?"
    );
  }

  if (!ctx.industry) {
    questions.push(
      ctx.language === "ar"
        ? "ما هو القطاع أو الصناعة التي يستهدفها مشروعك؟ (مثال: التعليم، الصحة، التجارة الإلكترونية)"
        : "What industry or sector does your project target? (e.g., Education, Healthcare, E-commerce)"
    );
  }

  if (!ctx.revenueModel) {
    questions.push(
      ctx.language === "ar"
        ? "كيف تخطط لتحقيق الإيرادات؟ (اشتراك شهري، دفع مرة واحدة، عمولة، إعلانات)"
        : "How do you plan to generate revenue? (Monthly subscription, one-time payment, commission, ads)"
    );
  }

  if (!ctx.budget) {
    questions.push(
      ctx.language === "ar"
        ? "ما هو الميزانية المتاحة للتطوير؟ وهل لديك تمويل أو تعتمد على التمويل الذاتي؟"
        : "What is your development budget? Are you funded or bootstrapping?"
    );
  }

  if (!ctx.teamSize) {
    questions.push(
      ctx.language === "ar"
        ? "ما حجم الفريق الذي ستبني به المشروع؟ وما هي الكفاءات المتوفرة؟"
        : "What is the team size building this? What skills do you have available?"
    );
  }

  return questions;
}

/**
 * Build the master system prompt for the AI consultant
 */
export function buildSystemPrompt(language: "en" | "ar"): string {
  if (language === "ar") {
    return `أنت مستشار أعمال متخصص ومحلل استراتيجي بارع، تجمع بين خبرة مؤسس شركة ناشئة ناجحة، ومهندس برمجيات أول، ومصمم UX/UI، ومدير منتج، وخبير تسويق رقمي.

مهمتك: تقديم مخطط أعمال شامل وعميق وقابل للتنفيذ بالكامل، يمكن لأي مطور أو فريق بناء المشروع منه دون طرح أسئلة إضافية.

قواعد الإجابة:
- كن محدداً وعملياً، تجنب العبارات العامة
- استخدم أرقاماً وبيانات واقعية حيثما أمكن
- خصص كل إجابة للمشروع المحدد، لا تعطِ إجابات قالبية
- استخدم العناوين والقوائم والجداول لتنظيم المعلومات
- اكتب بأسلوب احترافي ومباشر
- الرد الكامل يجب أن يكون باللغة العربية`;
  }

  return `You are an elite business consultant, strategic analyst, and technical architect combining the expertise of a successful startup founder, senior software engineer, UX/UI designer, product manager, and digital marketing expert.

Your mission: Deliver a comprehensive, deep, and fully actionable business blueprint that any developer or team can build from without asking additional questions.

Response rules:
- Be specific and practical, avoid generic statements
- Use real numbers and data wherever possible
- Personalize every answer to the specific project, never give template answers
- Use headers, lists, and tables to organize information
- Write in a professional, direct style
- The complete response must be in English`;
}

/**
 * Get a section definition by key
 */
export function getSectionByKey(key: string): SectionDefinition | undefined {
  return BLUEPRINT_SECTIONS.find((s) => s.key === key);
}

/**
 * Get section title based on language
 */
export function getSectionTitle(section: SectionDefinition, language: "en" | "ar"): string {
  return language === "ar" ? section.titleAr : section.title;
}
