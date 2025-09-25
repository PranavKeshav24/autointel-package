import { AIClientMessage, AIClientResponse, OpenRouterConfig } from "./types";
export declare function openRouterChat(messages: AIClientMessage[], config: OpenRouterConfig): Promise<AIClientResponse>;
