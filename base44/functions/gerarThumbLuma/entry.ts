Deno.serve(async (req) => {
  try {
    const { prompt, image_refs } = await req.json();

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

    // 1. Gerar a thumbnail com GPT Image 2
    const genRes = await fetch("https://api.wavespeed.ai/api/v3/openai/gpt-image-2/text-to-image", {
      method: "POST",
      headers,
      body: JSON.stringify({
        prompt,
        aspect_ratio: "16:9",
        resolution: "1k",
        quality: "medium",
        output_format: "jpeg",
        enable_sync_mode: false,
      }),
    });

    const genData = await genRes.json();
    if (!genRes.ok || !genData.data?.id) {
      return Response.json({ error: genData?.message || "Erro ao criar geração" }, { status: 500 });
    }

    let thumbUrl = await pollResult(genData.data.id);

    // 2. Se tiver foto do apresentador, usar GPT Image 2 Edit para aplicar o rosto
    if (image_refs && image_refs.length > 0) {
      const editRes = await fetch("https://api.wavespeed.ai/api/v3/openai/gpt-image-2/edit", {
        method: "POST",
        headers,
        body: JSON.stringify({
          images: [thumbUrl, image_refs[0]],
          prompt: "Keep the entire thumbnail exactly as it is — composition, background, text, colors, and all visual elements must remain identical. The only change is: replace the face of the person in the thumbnail with the face from the second reference image. Match the lighting, skin tone, and expression style of the original. Do not alter anything else.",
          aspect_ratio: "16:9",
          resolution: "1k",
          quality: "medium",
          output_format: "jpeg",
          enable_sync_mode: false,
        }),
      });

      const editData = await editRes.json();
      if (editRes.ok && editData.data?.id) {
        thumbUrl = await pollResult(editData.data.id);
      }
    }

    return Response.json({ url: thumbUrl });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});