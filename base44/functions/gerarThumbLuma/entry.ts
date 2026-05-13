import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { prompt, image_refs, style_refs } = await req.json();

    if (!prompt) return Response.json({ error: 'prompt is required' }, { status: 400 });

    const LUMA_API_KEY = Deno.env.get("LUMA");

    const body = {
      prompt,
      aspect_ratio: "16:9",
      model: "photon-1",
    };

    // character_ref: fotos do apresentador (até 4 imagens)
    if (image_refs && image_refs.length > 0) {
      body.character_ref = {
        identity0: {
          images: image_refs.slice(0, 4),
        },
      };
    }

    // style_ref: thumbnails de referência de estilo
    if (style_refs && style_refs.length > 0) {
      body.style_ref = style_refs.slice(0, 4).map(url => ({ url, weight: 0.8 }));
    }

    // 1. Criar a geração
    const createRes = await fetch("https://api.lumalabs.ai/dream-machine/v1/generations/image", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LUMA_API_KEY}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(body),
    });

    const createData = await createRes.json();

    if (!createRes.ok) {
      return Response.json({ error: createData?.detail || createData?.message || "Luma API error" }, { status: 500 });
    }

    const generationId = createData.id;

    // 2. Polling até completar (máx 120s)
    for (let i = 0; i < 40; i++) {
      await new Promise(r => setTimeout(r, 3000));

      const pollRes = await fetch(`https://api.lumalabs.ai/dream-machine/v1/generations/${generationId}`, {
        headers: {
          "Authorization": `Bearer ${LUMA_API_KEY}`,
          "Accept": "application/json",
        },
      });

      const pollData = await pollRes.json();

      if (pollData.state === "completed") {
        return Response.json({ url: pollData.assets.image });
      }

      if (pollData.state === "failed") {
        return Response.json({ error: pollData.failure_reason || "Generation failed" }, { status: 500 });
      }
    }

    return Response.json({ error: "Timeout: geração demorou mais de 2 minutos" }, { status: 504 });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});