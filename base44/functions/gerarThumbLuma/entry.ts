Deno.serve(async (req) => {
  try {
    const { prompt, image_refs, style_refs } = await req.json();

    if (!prompt) return Response.json({ error: 'prompt is required' }, { status: 400 });

    const API_KEY = Deno.env.get("wavespeed");

    const headers = {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    };

    // Helper: polling de resultado
    const pollResult = async (requestId) => {
      for (let i = 0; i < 40; i++) {
        await new Promise(r => setTimeout(r, 3000));
        const res = await fetch(`https://api.wavespeed.ai/api/v3/predictions/${requestId}/result`, { headers });
        const data = await res.json();
        if (data.data?.status === "completed") return data.data.outputs[0];
        if (data.data?.status === "failed") throw new Error(data.data.error || "Generation failed");
      }
      throw new Error("Timeout: geração demorou mais de 2 minutos");
    };

    // 1. Gerar a thumbnail com FLUX.1
    const genRes = await fetch("https://api.wavespeed.ai/api/v3/wavespeed-ai/flux-dev", {
      method: "POST",
      headers,
      body: JSON.stringify({
        prompt,
        size: "1280*720",
        num_inference_steps: 28,
        guidance_scale: 3.5,
        num_images: 1,
        output_format: "jpeg",
        enable_sync_mode: false,
      }),
    });

    const genData = await genRes.json();
    if (!genRes.ok || !genData.data?.id) {
      return Response.json({ error: genData?.message || "Erro ao criar geração" }, { status: 500 });
    }

    let thumbUrl = await pollResult(genData.data.id);

    // 2. Se tiver foto do apresentador, fazer face swap
    if (image_refs && image_refs.length > 0) {
      const faceRes = await fetch("https://api.wavespeed.ai/api/v3/wavespeed-ai/image-face-swap", {
        method: "POST",
        headers,
        body: JSON.stringify({
          image: thumbUrl,
          face_image: image_refs[0],
          output_format: "jpeg",
          enable_sync_mode: false,
        }),
      });

      const faceData = await faceRes.json();
      if (faceRes.ok && faceData.data?.id) {
        thumbUrl = await pollResult(faceData.data.id);
      }
    }

    return Response.json({ url: thumbUrl });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});