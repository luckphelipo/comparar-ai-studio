import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { prompt, image_refs, style_refs } = await req.json();

    if (!prompt) return Response.json({ error: 'prompt is required' }, { status: 400 });

    const allRefs = [
      ...(image_refs || []),
      ...(style_refs || []),
    ].filter(Boolean);

    const result = await base44.integrations.Core.GenerateImage({
      prompt,
      ...(allRefs.length > 0 ? { existing_image_urls: allRefs } : {}),
    });

    return Response.json({ url: result.url });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});