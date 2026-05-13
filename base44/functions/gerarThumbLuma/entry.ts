const LUMA_API_URL = 'https://api.lumalabs.ai/dream-machine/v1/generations/image';
const LUMA_API_KEY = Deno.env.get('LUMA_API_KEY');

async function pollGeneration(id, maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(r => setTimeout(r, 3000));
    const res = await fetch(`https://api.lumalabs.ai/dream-machine/v1/generations/${id}`, {
      headers: { Authorization: `Bearer ${LUMA_API_KEY}`, accept: 'application/json' },
    });
    const data = await res.json();
    if (data.state === 'completed') return data.assets?.image;
    if (data.state === 'failed') throw new Error(data.failure_reason || 'Luma generation failed');
  }
  throw new Error('Timeout: Luma generation took too long');
}

Deno.serve(async (req) => {
  try {
    const { prompt, image_refs, style_refs } = await req.json();

    if (!prompt) return Response.json({ error: 'prompt is required' }, { status: 400 });

    const body = {
      model: 'photon-1',
      prompt,
      aspect_ratio: '16:9',
      format: 'jpg',
      sync: false,
    };

    if (image_refs?.length > 0) {
      body.image_ref = image_refs.slice(0, 4).map(url => ({ url, weight: 0.85 }));
    }

    if (style_refs?.length > 0) {
      body.style_ref = style_refs.slice(0, 1).map(url => ({ url, weight: 0.7 }));
    }

    const res = await fetch(LUMA_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LUMA_API_KEY}`,
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    console.log('Luma response status:', res.status, JSON.stringify(data));
    if (!res.ok) throw new Error(JSON.stringify(data) || 'Luma API error');

    const imageUrl = await pollGeneration(data.id);
    return Response.json({ url: imageUrl });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});