import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { event } = await req.json();

    // Apenas processar atualizações de usuário
    if (event.type !== 'update' || event.entity_name !== 'User') {
      return Response.json({ ok: true });
    }

    const userId = event.entity_id;
    const user = await base44.asServiceRole.entities.User.list();
    const updatedUser = user.find(u => u.id === userId);

    if (!updatedUser || !updatedUser.email) {
      return Response.json({ ok: true });
    }

    const creditos = updatedUser.creditos || 0;

    // Enviar alerta se créditos estão entre 1 e 2
    if (creditos >= 1 && creditos <= 2) {
      await base44.integrations.Core.SendEmail({
        to: updatedUser.email,
        subject: `⚠️ Saldo de Créditos Baixo - ${creditos} Crédito${creditos !== 1 ? 's' : ''} Restante${creditos !== 1 ? 's' : ''}`,
        body: `Olá ${updatedUser.full_name || 'usuário'},\n\nVocê tem apenas ${creditos} crédito${creditos !== 1 ? 's' : ''} restante${creditos !== 1 ? 's' : ''} em sua conta.\n\nCada geração de thumbnail usa 1 crédito, e inserir um personagem usa mais 1 crédito.\n\nConsidere adquirir mais créditos para continuar gerando conteúdo.\n\nAtenciosamente,\nThumb Designer IA`,
      });
    }

    // Enviar alerta crítico se créditos chegam a 0
    if (creditos === 0) {
      await base44.integrations.Core.SendEmail({
        to: updatedUser.email,
        subject: `🚨 Créditos Esgotados - Ação Necessária`,
        body: `Olá ${updatedUser.full_name || 'usuário'},\n\nSeu saldo de créditos foi totalmente esgotado.\n\nVocê não poderá gerar mais thumbnails até adquirir novos créditos.\n\nContate o administrador para solicitar créditos adicionais.\n\nAtenciosamente,\nThumb Designer IA`,
      });
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error('Erro na automação de alertas:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});