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
      for (let i = 0; i < 120; i++) { // 120 * 3 segundos = 6 minutos
        await new Promise(r => setTimeout(r, 3000));
        const res = await fetch(`https://api.wavespeed.ai/api/v3/predictions/${requestId}/result`, { headers });
        const data = await res.json();
        if (data.data?.status === "completed") return data.data.outputs[0];
        if (data.data?.status === "failed") throw new Error(data.data.error || "Generation failed");
      }
      throw new Error("Timeout: geração demorou mais de 6 minutos");
    };

    let thumbUrl;

    // 1. Gerar a thumbnail — com referências de estilo (Edit) ou sem (Text-to-Image)
    if (style_refs && style_refs.length > 0) {
      // Usa GPT Image 2 Edit com até 3 referências de estilo visual
      const refsToUse = style_refs.slice(0, 3);
      const editStyleRes = await fetch("https://api.wavespeed.ai/api/v3/openai/gpt-image-2/edit", {
        method: "POST",
        headers,
        body: JSON.stringify({
          images: refsToUse,
          prompt: `Create a brand new YouTube thumbnail inspired by the visual style, composition, and color palette of the reference images. Do NOT copy the content — generate original content for this topic: ${prompt}`,
          aspect_ratio: "16:9",
          resolution: "1k",
          quality: "medium",
          output_format: "jpeg",
          enable_sync_mode: false,
        }),
      });
      const editStyleData = await editStyleRes.json();
      if (!editStyleRes.ok || !editStyleData.data?.id) {
        return Response.json({ error: editStyleData?.message || "Erro ao criar geração com referências" }, { status: 500 });
      }
      thumbUrl = await pollResult(editStyleData.data.id);
    } else {
      // Sem referências: geração direta text-to-image
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
      thumbUrl = await pollResult(genData.data.id);
    }

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