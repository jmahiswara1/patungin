import { AI_BASE_URL, AI_API_KEY, AI_FALLBACK_URL, AI_FALLBACK_API_KEY } from "@env";

// ── AI Providers ──

const PROVIDERS = [
  {
    name: "9router",
    baseUrl: AI_BASE_URL || "http://100.121.90.59:20128/v1",
    apiKey: AI_API_KEY || "",
  },
  {
    name: "bynara",
    baseUrl: AI_FALLBACK_URL || "https://router.bynara.id/v1",
    apiKey: AI_FALLBACK_API_KEY || "",
  },
];

const TIMEOUT_MS = 15000;

// ── Types ──

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string | Array<{ type: string; text?: string; image_url?: { url: string } }>;
}

interface AIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

// ── Core API ──

async function chatCompletion(
  model: string,
  messages: ChatMessage[],
  temperature = 0.1
): Promise<string> {
  let lastError: Error | null = null;

  for (const provider of PROVIDERS) {
    if (!provider.apiKey) continue;

    try {
      console.log(`[AI] Trying ${provider.name}...`);
      const response = await fetchWithTimeout(
        `${provider.baseUrl}/chat/completions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${provider.apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages,
            temperature,
            max_tokens: 2000,
          }),
        },
        TIMEOUT_MS
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`${provider.name} error: ${response.status} - ${error}`);
      }

      const data: AIResponse = await response.json();
      const content = data.choices[0]?.message?.content || "";
      console.log(`[AI] Success with ${provider.name}`);
      return content;
    } catch (e: any) {
      console.log(`[AI] ${provider.name} failed: ${e.message}`);
      lastError = e;
      continue;
    }
  }

  throw lastError || new Error("Semua AI provider gagal. Coba lagi nanti.");
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timeout);
  }
}

// ── Prompts ──

const SCAN_SYSTEM_PROMPT = `You are a receipt parser. Extract data from receipt images and return ONLY valid JSON with this exact structure:
{
  "items": [
    {"name": "item name", "price": 15000, "quantity": 1}
  ],
  "subtotal": 50000,
  "discount": 0,
  "shipping": 0,
  "total": 50000,
  "platform": "lainnya"
}

Rules:
- price is per item in Rupiah (integer, no decimals)
- quantity is integer >= 1
- subtotal = sum of (price * quantity) for all items
- total = subtotal - discount + shipping
- platform: "shopee" | "grabfood" | "tokped" | "lainnya"
- If you can't determine a value, use 0
- Return ONLY the JSON, no explanation`;

const PARSE_SYSTEM_PROMPT = `You are a bill splitting assistant. Parse natural language bill requests and return ONLY valid JSON with this exact structure:
{
  "items": [
    {"name": "item name", "price": 15000, "quantity": 1, "participants": ["person1", "person2"]}
  ],
  "subtotal": 50000,
  "discount": 0,
  "shipping": 0,
  "total": 50000
}

Rules:
- Extract item names, prices in Rupiah, quantities
- Identify who ordered what from the text
- If price not mentioned, use 0
- If quantity not mentioned, use 1
- subtotal = sum of (price * quantity) for all items
- total = subtotal - discount + shipping
- Return ONLY the JSON, no explanation`;

// ── Public Types ──

export interface ParsedReceipt {
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  platform: string;
  confidence?: number;
}

export interface ParsedBillRequest {
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    participants: string[];
  }>;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}

// ── Public Functions ──

export async function scanReceipt(imageBase64: string): Promise<ParsedReceipt> {
  const content = [
    {
      type: "image_url",
      image_url: {
        url: `data:image/jpeg;base64,${imageBase64}`,
      },
    },
    {
      type: "text",
      text: "Parse this receipt image and extract all items with prices, quantities, discount, shipping, and total.",
    },
  ];

  const response = await chatCompletion(
    "mistral-medium-3-5",
    [
      { role: "system", content: SCAN_SYSTEM_PROMPT },
      { role: "user", content: content as any },
    ]
  );

  try {
    const json = extractJSON(response);
    const parsed = JSON.parse(json);

    return {
      items: (parsed.items || []).map((item: any) => ({
        name: String(item.name || "Unknown"),
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
      })),
      subtotal: Number(parsed.subtotal) || 0,
      discount: Number(parsed.discount) || 0,
      shipping: Number(parsed.shipping) || 0,
      total: Number(parsed.total) || 0,
      platform: String(parsed.platform || "lainnya"),
      confidence: parsed.confidence,
    };
  } catch (e) {
    throw new Error("Gagal parse hasil AI. Coba input manual.");
  }
}

export async function parseBillRequest(
  message: string,
  memberNames: string[] = []
): Promise<ParsedBillRequest> {
  const context =
    memberNames.length > 0
      ? `\nAvailable members: ${memberNames.join(", ")}`
      : "";

  const response = await chatCompletion(
    "mimo-v2.5-pro",
    [
      { role: "system", content: PARSE_SYSTEM_PROMPT + context },
      { role: "user", content: message },
    ]
  );

  try {
    const json = extractJSON(response);
    const parsed = JSON.parse(json);

    return {
      items: (parsed.items || []).map((item: any) => ({
        name: String(item.name || "Unknown"),
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
        participants: Array.isArray(item.participants) ? item.participants.map(String) : [],
      })),
      subtotal: Number(parsed.subtotal) || 0,
      discount: Number(parsed.discount) || 0,
      shipping: Number(parsed.shipping) || 0,
      total: Number(parsed.total) || 0,
    };
  } catch (e) {
    throw new Error("Gagal parse permintaan. Coba tulis lebih jelas.");
  }
}

// ── Helpers ──

function extractJSON(text: string): string {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return jsonMatch[0];
  }
  throw new Error("No JSON found in response");
}
