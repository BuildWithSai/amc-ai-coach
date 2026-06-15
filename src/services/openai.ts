/**
 * The only file that calls the OpenAI API.
 * Uses JSON mode so the model always returns valid JSON. Swap BASE_URL and MODEL
 * here to point at a different provider. Returns null on any error.
 */

const BASE_URL = 'https://api.openai.com/v1/chat/completions'
const MODEL = 'gpt-4o'

export async function callOpenAI<T>(
  systemPrompt: string,
  userPrompt: string
): Promise<T | null> {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        // JSON mode — forces the model to return valid JSON every time
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
    })

    const data = await response.json()

    // Log in dev so we can see exactly what prompt was sent and what came back
    if (import.meta.env.DEV) {
      console.log('[OpenAI] prompt:', userPrompt)
      console.log('[OpenAI] response:', data)
    }

    const content = data.choices[0].message.content
    return JSON.parse(content) as T

  } catch (error) {
    // Never throw to the UI — return null and let the component handle it
    console.error('[OpenAI] error:', error)
    return null
  }
}