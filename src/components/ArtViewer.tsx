import React, { useState } from 'react';

// 1. Definição do Tipo para os Marcadores (Pins)
// Isso garante que o TypeScript saiba o que esperar de cada comentário.
interface CommentMarker {
  id: string;
  x: number; // Posição horizontal em Porcentagem (0-100)
  y: number; // Posição vertical em Porcentagem (0-100)
  text: string;
}

export default function ArtViewer() {
  // Estado para armazenar a lista de marcadores na tela
  const [markers, setMarkers] = useState<CommentMarker[]>([]);

  // Imagem de exemplo para teste imediato (uma arte abstrata)
  const imageUrl = "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=1200&q=80";

  // 2. A Mágica do Cálculo de Posição
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // 'e.currentTarget' é o elemento <div> que envolve a imagem (onde colocamos o onClick)
    const rect = e.currentTarget.getBoundingClientRect();

    // Calcula onde foi o clique relativo ao canto superior esquerdo da imagem, e não da tela inteira.
    const clickXRelativeToImage = e.clientX - rect.left;
    const clickYRelativeToImage = e.clientY - rect.top;

    // --- O PULO DO GATO: Converter para Porcentagem ---
    // Dividimos a posição do clique pela largura/altura total da imagem e multiplicamos por 100.
    // Isso garante que o pino fique no lugar certo mesmo se você redimensionar a janela.
    const xPercent = (clickXRelativeToImage / rect.width) * 100;
    const yPercent = (clickYRelativeToImage / rect.height) * 100;

    // Cria o novo objeto marcador
    const newMarker: CommentMarker = {
      id: Date.now().toString(), // Gera um ID único simples base no tempo
      x: xPercent,
      y: yPercent,
      // Num app real, aqui você abriria um Modal pedindo para o usuário digitar o texto.
      // Para teste, vamos gerar um texto automático com a posição.
      text: `Ajuste necessário aqui (X: ${Math.round(xPercent)}%, Y: ${Math.round(yPercent)}%)`
    };

    // Adiciona o novo marcador à lista existente
    setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-slate-800">Aprovação de Arte</h2>
      <p className="text-slate-600 mb-6">Clique na imagem para adicionar um comentário.</p>
      
      {/* 3. Container Principal (relative group) 
         - 'relative': Essencial para que os pinos (absolute) se posicionem em relação a este container.
         - 'group': Usado para mostrar o tooltip quando passamos o mouse no pino.
      */}
      <div 
        className="relative inline-block w-full max-w-4xl border-4 border-white rounded-xl shadow-xl overflow-hidden group bg-white cursor-crosshair"
        onClick={handleImageClick}
      >
        {/* A Imagem da Arte */}
        <img 
          src={imageUrl} 
          alt="Design para aprovação" 
          // 'pointer-events-none' é importante para que o clique passe para a DIV pai (o container relative)
          // que é onde estamos calculando o retângulo corretamente.
          className="w-full h-auto pointer-events-none select-none"
        />

        {/* 4. Renderização dos Marcadores (Pins) */}
        {markers.map((marker) => (
          <div
            key={marker.id}
            // Posicionamento absoluto baseado nas porcentagens calculadas.
            // w-6 h-6 define um tamanho de 24px.
            // -ml-3 -mt-3 (margem negativa de metade do tamanho) serve para centralizar o pino EXATAMENTE onde foi o clique.
            className="absolute w-6 h-6 -ml-3 -mt-3 bg-red-500 rounded-full border-2 border-white shadow-sm hover:scale-125 transition-transform z-10 group/pin"
            style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
          >
             {/* Tooltip que aparece ao passar o mouse no pino (graças ao 'group/pin' e 'group-hover/pin') */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/pin:block w-max max-w-xs bg-slate-800 text-white text-xs rounded py-1 px-2 shadow-lg whitespace-normal text-center z-20">
                {marker.text}
              {/* Setinha do tooltip */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
            </div>
          </div>
        ))}
      </div>
       <p className="text-xs text-slate-400 mt-4">Total de comentários: {markers.length}</p>
    </div>
  );
}