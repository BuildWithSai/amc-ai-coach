// Calls the Supabase Edge Function instead of OpenAI directly.
// The OpenAI API key lives in Supabase secrets — never in the browser bundle.


const EDGE_FUNCTION_URL = 'https://yzgifrvfvxtmulwmbuzb.supabase.co/functions/v1/ai-coach'

export async function callOpenAI<T>(
  systemPrompt: string,
  userPrompt: string
): Promise<T | null> {
  try {
    const response = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Supabase anon key authenticates the request to the Edge Function
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ systemPrompt, userPrompt }),
    })

    const data = await response.json()

// Log in dev so we can see exactly what prompt was sent and what came back
if (import.meta.env.DEV) {
  console.log('[EdgeFn] prompt:', userPrompt)
  console.log('[EdgeFn] response:', data)
}

// Edge Function returns parsed JSON directly — no need to unwrap choices[]
return data as T

  } catch (error) {
    // Never throw to the UI — return null and let the component handle it
    console.error('[OpenAI] error:', error)
    return null
  }
}