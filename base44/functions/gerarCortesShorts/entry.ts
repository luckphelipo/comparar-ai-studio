import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { roteiro, funil } = await req.json();

    if (!roteiro || !funil) {
      return Response.json({ error: 'Roteiro e funil são obrigatórios' }, { status: 400 });
    }

    const prompt = funil === 'top'
      ? `Analise o seguinte roteiro de vídeo e identifique os melhores CORTES para shorts virais. Procure por momentos com gancho emocional, surpresa, curiosidade máxima e picos de entretenimento. IMPORTANTE: cada corte deve ter no mínimo 30 segundos de conteúdo (o trecho do roteiro deve ser longo o suficiente para preencher pelo menos 30 segundos de fala).

Roteiro:
${roteiro}

Retorne um JSON com este formato exato:
{
  "cortes": [
    {
      "label": "Título do corte",
      "texto": "Trecho do roteiro",
      "inicio": "tempo ou parágrafo",
      "score": 90
    }
  ]
}

Retorne APENAS o JSON, sem explicações adicionais.`
      : `Analise o seguinte roteiro de vídeo e identifique os melhores CORTES para shorts de conversão. Procure por explicações-chave, provas de autoridade, informações de alto impacto e call-to-action. IMPORTANTE: cada corte deve ter no mínimo 30 segundos de conteúdo (o trecho do roteiro deve ser longo o suficiente para preencher pelo menos 30 segundos de fala).

Roteiro:
${roteiro}

Retorne um JSON com este formato exato:
{
  "cortes": [
    {
      "label": "Título do corte",
      "texto": "Trecho do roteiro",
      "inicio": "tempo ou parágrafo",
      "score": 90
    }
  ]
}

Retorne APENAS o JSON, sem explicações adicionais.`;

    const response = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          cortes: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                label: { type: 'string' },
                texto: { type: 'string' },
                inicio: { type: 'string' },
                score: { type: 'number' }
              }
            }
          }
        }
      }
    });

    return Response.json(response);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});