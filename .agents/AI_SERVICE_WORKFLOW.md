# EduQuest AI - AI Service Architecture & Workflow

## 🎯 Overview
`@backend/app/services/ai_service.py` is the core engine responsible for interfacing with Large Language Models (LLMs) to generate and regenerate educational questions (soal). It is heavily tailored to align with Indonesia's "Kurikulum Merdeka" standard, ensuring that generated content is age-appropriate, accurate, and structurally consistent.

This document is intended for AI agents and developers to understand the workflow and logic behind the generation process.

---

## ⚙️ Core Workflow

The generation pipeline follows a consistent **Prepare ➔ Request ➔ Parse** pattern.

### 1. Configuration & Provider Selection
The application supports multiple LLM providers:
- **Google Gemini** (Default)
- **Groq** (Fast inference)
- **OpenRouter** (Targeting models like Qwen)

The service fetches the active provider and API key dynamically via `_get_ai_config()`, which connects to the application's settings state.

### 2. Prompt Engineering & Assembly
The prompt construction is handled by `_build_user_prompt` (for batch generation) and `_build_regenerate_prompt` (for single question regeneration).

- **System Prompt**: Sets the AI persona to "Pendidik ahli evaluasi Kurikulum Merdeka".
- **Content Truncation (`_truncate_content`)**: Limits the source document text to `8000` characters. If it exceeds this, it truncates safely at the nearest sentence boundary and appends a warning tag.
- **Dynamic Instructions**: Translates user inputs (Difficulty, Style/Gaya, Phase/Kelas) into specific AI directives. For example, "HOTS" triggers an instruction to test analysis and evaluation.
- **Strict JSON Schema**: Embeds a stringified JSON schema directly into the prompt to guide the LLM's output structure (Question, Options, Answer, Explanation).

### 3. Asynchronous AI Execution
Dedicated async functions handle the network requests to each provider:
- `_generate_with_gemini()`
- `_generate_with_groq()`
- `_generate_with_openrouter()`

**Resilience Features:**
- Each function implements a `max_retries` loop (default: 3).
- Uses exponential backoff (`await asyncio.sleep(2 ** (attempt + 1))`) specifically to handle Server Errors and `429 Rate Limit` exceptions gracefully.

### 4. Robust Response Parsing (`_parse_ai_response`)
LLMs are unpredictable and sometimes wrap JSON in markdown or include conversational text. The parsing function:
1. Strips markdown backticks (`` ```json ``).
2. Attempts standard `json.loads()`.
3. **Fallback Mechanism**: If decoding fails, it uses string slicing (`find("{")` to `rfind("}")`) to extract the JSON payload hidden within conversational text.

### 5. Main Interfaces
- **`generate_soal`**: Generates a batch of questions based on a module's content.
- **`regenerate_single_soal`**: Replaces a single rejected question with a new one, accepting direct `feedback_user` to correct specific mistakes while retaining the original context.
- **`test_ai_connection`**: A lightweight ping utility to validate API keys in the settings UI.

---

## 💡 Suggestions for Improvement (Senior Developer Perspective)

For future iterations or agents working on refactoring, consider the following architectural improvements:

### 1. Dependency Injection (DI)
Currently, `_get_ai_config()` relies on an inline import to fetch configuration. 
**Suggestion**: Pass the `provider` and `api_key` directly as arguments from the Router/Controller layer into `generate_soal`. This makes the service purely functional, easier to unit test, and decouples it from the configuration logic.

### 2. Structured Outputs with Pydantic
The current approach relies on manual JSON schema stringification and a custom `_parse_ai_response` fallback.
**Suggestion**: Implement **Pydantic Models** defining the exact output schema. Use libraries like `Instructor` or the native Structured Outputs API provided by Gemini/Groq SDKs. This guarantees type-safe responses and eliminates the need for string manipulation fallbacks.

### 3. Strategy Pattern for Providers
The `if/elif/else` blocks inside `generate_soal` will become bloated if more providers are added (e.g., OpenAI, Anthropic).
**Suggestion**: Refactor using the Strategy Pattern. Create a base abstract class (e.g., `BaseAIGenerator`) with a standard `generate()` interface, and subclass it for Gemini, Groq, and OpenRouter.

### 4. Token-Based Truncation
Character counting (`MAX_CONTENT_CHARS = 8000`) is an inaccurate proxy for token limits.
**Suggestion**: Use a lightweight tokenizer library (like `tiktoken` or a Gemini equivalent) to count exact tokens. This ensures the prompt always fits snugly into the context window without wasting space or causing unexpected `TooManyTokens` errors.
