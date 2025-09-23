import { AIClientMessage, AIClientResponse, OpenRouterConfig } from "./types";

const DEFAULT_MODEL = "openai/gpt-oss-120b:free";

export async function openRouterChat(
  messages: AIClientMessage[],
  config: OpenRouterConfig
): Promise<AIClientResponse> {
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
  const data = (await resp.json()) as AIClientResponse;
  return data;
}
