import Anthropic from '@anthropic-ai/sdk'

// Shared Anthropic client — server-only, never import from client components.
export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// Model constants
export const MODELS = {
  /** Complex reasoning, tool use, multimodal extraction */
  OPUS: 'claude-opus-4-5' as const,
  /** Balanced — default for most tasks */
  SONNET: 'claude-sonnet-4-5' as const,
  /** Fast, cheap — classification, short answers */
  HAIKU: 'claude-haiku-4-5' as const,
} as const
