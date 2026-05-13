import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Buscar todos os usuários
    const users = await base44.asServiceRole.entities.User.list();
    
    // Resetar análises para cada usuário
    const now = new Date().toISOString();
    for (const user of users) {
      await base44.asServiceRole.entities.User.update(user.id, {
        analises_restantes_mes: 20,
        ultimo_reset_analises: now
      });
    }
    
    return Response.json({ 
      success: true, 
      message: `${users.length} usuários resetados com sucesso` 
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});