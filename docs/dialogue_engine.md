# Dialogue & Intent Engine - Faclie Client Simulator

Faclie runs a hybrid dialogue engine that combines static local keyword intent classification with online generative AI personas to ensure realistic and responsive client behaviors.

## Dialogue State Flow

Client dialogue progresses through standard project pipeline stages:

1.  **Onboarding**: Initial greeting and availability verification.
2.  **Briefing**: Presenting basic project requirements.
3.  **Negotiation**: Agreeing on contract terms, budgets, and milestones.
4.  **Execution**: Reviewing drafts and wireframes (where scope creeps are triggered).
5.  **Feedback**: Reviewing updates and addressing minor revisions.
6.  **Payment**: Final invoice review (where payment delays or discounts are triggered).
7.  **Completed**: Game complete, scorecard performance evaluation generated.

## Intent Parsing (Local)

The system maps freelancer texts into intent tags defined in [intentParser.ts](file:///d:/Project/Faclie.com/src/services/intentParser.ts):

-   `greeting`: "hello", "hi", "halo", "selamat pagi".
-   `scope_creep_resistance`: "out of scope", "extra fee", "tambah biaya", "not in contract", "renegosiasi".
-   `scope_creep_acceptance`: "sure", "bisa pak", "boleh gratis", "free of charge", "no problem".
-   `price_negotiation`: "dp", "deposit", "budget", "pembayaran", "uang muka", "invoice".
-   `price_concession`: "diskon", "potong harga", "oke diskon", "tidak apa apa".
-   `submission`: "submit", "draft", "link figma", "ini wireframe", "layout".
-   `confrontation`: "bayar", "payout", "tagihan", "dp belum masuk", "kontrak".

If a freelancer's message matches any of these keywords, the frontend attaches the corresponding `detectedIntent` tag to the message bubble.

## Fallback Offline Dialogue Tree

If the server has no NVIDIA API key configured, or if connections fail, [dialogTree.ts](file:///d:/Project/Faclie.com/src/services/dialogTree.ts) handles response paths:
-   Checks current client stage.
-   Evaluates the freelancer's detected intent.
-   Updates memories (e.g. `easy_target`, `denied_code_creep`).
-   Returns custom replies matching the client's preferred language and tone.

## NVIDIA AI Completion Route

If `NVIDIA_API_KEY` is present, the API router ([route.ts](file:///d:/Project/Faclie.com/src/app/api/chat/route.ts)) calls the NVIDIA integrated AI model `stepfun-ai/step-3.5-flash`:
1.  **System Prompt Assembly**: Builds a full persona profile combining the client's Big-Five traits, bio, quirks, red flags, language rules, and current satisfaction/patience metrics.
2.  **JSON Schema Output**: Instructs the model to output a strict JSON payload:
    ```json
    {
      "reply": "...",
      "emotionalShift": { "satisfaction": 0, "patience": 0, "urgency": 0 },
      "pipelineShift": "execution",
      "memoryUpdates": { "key": "value" },
      "riskTriggered": { "title": "...", "description": "...", "severity": "medium" }
    }
    ```
3.  **Language Rules Enforcement**: Prompt enforces colloquial Indonesian phrasing (using ending particles like `sih`, `kok`, `ya`), Jaksel startup code-mixing (`literally`, `which is`), or plain English, adjusting formatting and spelling mistakes according to the client's current stress (Neuroticism) level.
