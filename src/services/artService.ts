// src/services/artService.ts
import { supabase } from '../lib/supabase'; // Importa do arquivo acima

export async function uploadNewVersion(projectId: string, file: File) {
  try {
    // 1. Descobrir a última versão
    const { data: lastVersion, error: fetchError } = await supabase
      .from('versions')
      .select('version_number')
      .eq('project_id', projectId)
      .order('version_number', { ascending: false })
      .limit(1)
      .maybeSingle(); // <--- USE ISSO NO LUGAR DE .single()

    // Se der erro de conexão (não de "não encontrado"), lançamos o erro
    if (fetchError) throw fetchError;

    // Se lastVersion for null (primeira vez), assume 0 + 1 = v1
    const nextVersionNumber = (lastVersion?.version_number || 0) + 1;

    // 2. Definir caminho do arquivo
    const fileExt = file.name.split('.').pop();
    // Dica: Adicionei o ID do projeto na frente para organizar pastas no bucket
    const filePath = `${projectId}/v${nextVersionNumber}_${Date.now()}.${fileExt}`;

    // ... (O resto do seu código de upload e insert segue igual) ...
    
    // Apenas para completar o raciocínio caso precise copiar:
    const { error: uploadError } = await supabase.storage
        .from('project-files')
        .upload(filePath, file);
    
    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
        .from('project-files')
        .getPublicUrl(filePath);

    const { error: dbError } = await supabase
        .from('versions')
        .insert({
            project_id: projectId,
            version_number: nextVersionNumber,
            image_path: publicUrl,
            status: 'pending'
        });

    if (dbError) throw dbError;

    return { success: true, version: nextVersionNumber };

  } catch (error) {
    console.error('Erro no upload:', error);
    return { success: false, error };
  }
}