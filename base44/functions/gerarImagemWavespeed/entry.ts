import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prompt } = await req.json();

    if (!prompt || !prompt.trim()) {
      return Response.json({ error: 'Prompt é obrigatório' }, { status: 400 });
    }

    const wavespeedApiKey = Deno.env.get('wavespeed');
    if (!wavespeedApiKey) {
      return Response.json({ error: 'Wavespeed API key não configurada' }, { status: 500 });
    }

    const response = await fetch('https://api.wavespeed.io/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${wavespeedApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        model: 'nano-banana-2',
        num_images: 1,
        size: '1024x1024',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return Response.json({ error: `Erro da Wavespeed: ${error}` }, { status: response.status });
    }

    const data = await response.json();

    if (data.data && data.data.length > 0) {
      return Response.json({
        url: data.data[0].url,
        success: true,
      });
    } else {
      return Response.json({ error: 'Nenhuma imagem foi gerada' }, { status: 500 });
    }
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});