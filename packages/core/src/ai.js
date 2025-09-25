"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openRouterChat = openRouterChat;
const DEFAULT_MODEL = "openai/gpt-oss-120b:free";
async function openRouterChat(messages, config) {
    config.apiKey = config.apiKey ?? process.env.OPENROUTER_API_KEY ?? "";
    const model = config.model ?? DEFAULT_MODEL;
    const resp = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${config.apiKey}`,
            "HTTP-Referer": config.referer ?? "https://local.dev",
            "X-Title": config.title ?? "AutoIntel",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ model, messages }),
    });
    if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`OpenRouter error ${resp.status}: ${text}`);
    }
    const data = (await resp.json());
    return data;
}
//# sourceMappingURL=ai.js.map