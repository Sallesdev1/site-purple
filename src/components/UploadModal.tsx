// src/components/UploadModal.tsx
import { useState } from 'react';
import { uploadNewVersion } from '../services/artService'; // <--- IMPORTANTE

export function UploadModal({ projectId }: { projectId: string }) {
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setLoading(true);

    // CHAMA A LÓGICA AQUI
    const result = await uploadNewVersion(projectId, file);

    setLoading(false);

    if (result.success) {
      alert(`Versão ${result.version} criada com sucesso!`);
      // Aqui você poderia recarregar a lista de versões
    } else {
      alert('Erro ao enviar arquivo.');
    }
  };

  return (
    <div className="p-4 border rounded shadow-sm">
      <h3 className="font-bold mb-2">Enviar Nova Versão</h3>
      
      <input 
        type="file" 
        onChange={handleFileChange}
        disabled={loading}
        className="block w-full text-sm text-slate-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-violet-50 file:text-violet-700
          hover:file:bg-violet-100"
      />
      
      {loading && <p className="text-sm text-gray-500 mt-2">Enviando e processando...</p>}
    </div>
  );
}