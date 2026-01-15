import React, { useState } from 'react';
import { 
  LayoutGrid, Users, FileText, Plus, Search, Filter, 
  ChevronDown, MoreHorizontal, ChevronLeft, Link as LinkIcon,
  Settings, Trash2, Archive, UploadCloud, X, Calendar, CheckCircle2,
  FileImage, Clock, AlertCircle
} from 'lucide-react';

// --- TIPOS ---
type ViewType = 'jobs' | 'clientes' | 'relatorios';
type JobTabType = 'dados' | 'itens' | 'aprovacao' | 'excluir' | 'arquivar';
type JobStatus = 'pending' | 'approval' | 'changes' | 'approved';

interface Job {
  id: string;
  title: string;
  client: string;
  status: JobStatus;
  initials: string;
  version: number;
}

interface JobItem {
  id: string;
  title: string;
  version: number;
  date: string;
  status: string;
  thumbnail: string;
}

// --- DADOS MOCKADOS (Baseados nos prints) ---
const MOCK_JOBS: Job[] = [
  { id: '1', title: 'NOME BASE', client: 'ARENA DO MOMENTO', status: 'pending', initials: 'AT', version: 1 },
  { id: '2', title: 'EST | VOLTA AS AULAS', client: 'SUPERFUT', status: 'pending', initials: 'WS', version: 2 },
  { id: '3', title: 'Post Case SAP', client: 'INFRATECH', status: 'pending', initials: 'RM', version: 1 },
  { id: '4', title: 'EST | VOLTAS AS AULAS [2]', client: 'SUPERFUT', status: 'approval', initials: 'WS', version: 3 },
  { id: '5', title: 'CARROSSEL | ROTHA', client: 'ROTHA FITNESS', status: 'changes', initials: 'WS', version: 4 },
  { id: '6', title: 'Aula Microfonada', client: 'BEACH ARENA', status: 'approved', initials: 'RM', version: 5 },
];

const MOCK_CLIENTS = [
  { id: 1, name: 'INFRATECH', approvers: 1 },
  { id: 2, name: 'MHA ESTÉTICA', approvers: 1 },
  { id: 3, name: 'PROCOPIO', approvers: 1 },
  { id: 4, name: 'BEACH ARENA', approvers: 1 },
  { id: 5, name: 'TENNIS LOUNGE', approvers: 1 },
  { id: 6, name: 'EL PATRON', approvers: 1 },
  { id: 7, name: 'ROTHA FITNESS', approvers: 1 },
];

const MOCK_ITEMS: JobItem[] = [
  { id: 'i1', title: 'FUTEBOL A DOMICILIO PARA CRIANÇAS', version: 2, date: '15/01/2026 18:43', status: 'Em Aprovação', thumbnail: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=200&h=200&fit=crop' }
];

// --- COMPONENTE PRINCIPAL ---
export default function FullDashboard() {
  const [currentView, setCurrentView] = useState<ViewType>('jobs');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // Renderização condicional das telas principais
  const renderContent = () => {
    if (selectedJob) {
      return <JobDetailView job={selectedJob} onBack={() => setSelectedJob(null)} />;
    }

    switch (currentView) {
      case 'jobs': return <KanbanView onSelectJob={setSelectedJob} />;
      case 'clientes': return <ClientsView />;
      case 'relatorios': return <ReportsView />;
      default: return <KanbanView onSelectJob={setSelectedJob} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-slate-800 flex flex-col">
      {/* Header Global (Fixo) */}
      <header className="bg-white border-b border-slate-200 px-6 h-14 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          {/* Logo AprovaJob (Simulado) */}
          <div className="flex items-center gap-1 text-pink-600 font-bold text-xl">
             <div className="w-6 h-6 bg-pink-600 rounded-md transform rotate-45 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
             </div>
             Aprovajob
          </div>
        </div>

        <div className="flex items-center gap-4">
           <button className="flex items-center gap-2 text-xs border border-slate-300 rounded-md px-3 py-1.5 hover:bg-slate-50 transition text-slate-600 bg-white">
             SQUAD 1 PURPLE <ChevronDown size={14} />
           </button>
           <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold border border-emerald-200 relative">
             WS
             <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
           </div>
        </div>
      </header>

      {/* Navegação de Abas (Jobs / Clientes / Relatórios) */}
      <div className="bg-white border-b border-slate-200 px-6 pt-1">
        <div className="flex gap-8">
          <TabButton 
            isActive={currentView === 'jobs'} 
            onClick={() => { setCurrentView('jobs'); setSelectedJob(null); }}
            icon={<LayoutGrid size={18} />} 
            label="Jobs" 
          />
          <TabButton 
            isActive={currentView === 'clientes'} 
            onClick={() => { setCurrentView('clientes'); setSelectedJob(null); }}
            icon={<Users size={18} />} 
            label="Clientes" 
          />
          <TabButton 
            isActive={currentView === 'relatorios'} 
            onClick={() => { setCurrentView('relatorios'); setSelectedJob(null); }}
            icon={<FileText size={18} />} 
            label="Relatórios" 
          />
        </div>
      </div>

      {/* Área de Conteúdo Dinâmico */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {renderContent()}
      </main>
    </div>
  );
}

// --- VIEW 1 ATUALIZADA: KANBAN (JOBS) ---
function KanbanView({ onSelectJob }: { onSelectJob: (job: Job) => void }) {
  // Novo estado para controlar o modal
  const [isNewJobModalOpen, setIsNewJobModalOpen] = useState(false);

  const cols = [
    { id: 'pending', label: 'Jobs Pendentes', count: 3, color: 'indigo' },
    { id: 'approval', label: 'Jobs em Aprovação', count: 53, color: 'orange' },
    { id: 'changes', label: 'Jobs em Alteração', count: 15, color: 'red' },
    { id: 'approved', label: 'Jobs Aprovados', count: 312, color: 'green' },
  ];

  const getColorClasses = (color: string) => {
    const map: any = {
      indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100', badge: 'bg-indigo-600' },
      orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100', badge: 'bg-orange-600' },
      red: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100', badge: 'bg-red-600' },
      green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-100', badge: 'bg-green-600' },
    };
    return map[color];
  };

  return (
    <>
      <div className="p-6 flex-1 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 text-slate-700 font-semibold text-xl">
             <LayoutGrid size={24} className="text-slate-400" />
             Jobs
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-indigo-200 text-indigo-600 rounded-md text-sm hover:bg-indigo-50">
              <Filter size={16} /> Filtros
            </button>
            
            {/* --- BOTÃO CORRIGIDO AQUI --- */}
            <button 
              onClick={() => setIsNewJobModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#6366F1] text-white rounded-md text-sm font-medium hover:bg-indigo-700 shadow-sm shadow-indigo-200"
            >
              <Plus size={16} /> Novo Job
            </button>
          </div>
        </div>

        <div className="flex gap-4 min-w-[1200px] pb-4">
          {cols.map(col => {
            const styles = getColorClasses(col.color);
            const jobs = MOCK_JOBS.filter(j => j.status === col.id);
            
            return (
              <div key={col.id} className="flex-1 min-w-[280px] flex flex-col">
                <div className={`flex items-center justify-between px-4 py-3 rounded-t-lg border-t border-x ${styles.bg} ${styles.border}`}>
                  <span className={`font-medium text-sm ${styles.text}`}>{col.label}</span>
                  <span className={`${styles.badge} text-white text-xs font-bold px-2 py-0.5 rounded-full`}>{col.count}</span>
                </div>
                
                <div className="bg-slate-100/50 p-2 rounded-b-lg border border-t-0 border-slate-200 flex-1 flex flex-col gap-3 min-h-[500px]">
                  {jobs.map(job => (
                    <div key={job.id} onClick={() => onSelectJob(job)} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:shadow-md cursor-pointer group transition-all">
                       <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] text-slate-400 font-mono px-1.5 py-0.5 bg-slate-100 rounded border border-slate-200">
                            v{job.version}
                          </span>
                          {job.status === 'pending' && <span className="w-2 h-2 rounded-full bg-indigo-400"></span>}
                          {job.status === 'approval' && <span className="w-2 h-2 rounded-full bg-orange-400"></span>}
                       </div>
                       <h4 className="font-semibold text-slate-800 text-sm mb-1 leading-snug">{job.title}</h4>
                       <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wide mb-3">{job.client}</p>
                       
                       <div className="flex justify-between items-center border-t border-slate-50 pt-2 mt-1">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border ${job.initials === 'WS' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                            {job.initials}
                          </div>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- RENDERIZA O MODAL SE O ESTADO FOR TRUE --- */}
      {isNewJobModalOpen && <NewJobModal onClose={() => setIsNewJobModalOpen(false)} />}
    </>
  );
}

// --- VIEW 2: CLIENTES ---
function ClientsView() {
  return (
    <div className="p-6 max-w-6xl mx-auto w-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 text-slate-700 font-semibold text-xl">
           <Users size={24} className="text-slate-400" />
           Clientes
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#6366F1] text-white rounded-md text-sm font-medium hover:bg-indigo-700 shadow-sm shadow-indigo-200">
          <Plus size={16} /> Novo Cliente
        </button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 uppercase font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 w-3/4">Nome</th>
              <th className="px-6 py-3">Nº Aprovadores</th>
              <th className="px-6 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MOCK_CLIENTS.map(client => (
              <tr key={client.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-700">{client.name}</td>
                <td className="px-6 py-4">
                  <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded text-xs font-bold border border-indigo-100">
                    {client.approvers}
                  </span>
                </td>
                <td className="px-6 py-4 text-right flex justify-end gap-2 text-slate-400">
                   <button className="hover:text-indigo-600"><FileText size={16} /></button>
                   <button className="hover:text-red-600"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 border-t border-slate-200 text-xs text-slate-400">
          Total de {MOCK_CLIENTS.length} clientes cadastrados
        </div>
      </div>
    </div>
  );
}

// --- VIEW 3: RELATÓRIOS ---
function ReportsView() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-2 text-slate-700 font-semibold text-xl mb-6">
         <FileText size={24} className="text-slate-400" />
         Relatórios
      </div>

      <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm max-w-4xl">
        <div className="mb-6 p-3 bg-red-50 text-red-600 text-xs font-medium rounded border border-red-100 flex items-center gap-2">
           <AlertCircle size={14} />
           Temporariamente indisponível. Em breve será disponibilizado com novas melhorias.
        </div>
        
        <div className="grid grid-cols-2 gap-6 opacity-50 pointer-events-none select-none">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Data de Início</label>
            <div className="relative">
               <input type="text" placeholder="dd/mm/aaaa" className="w-full border border-slate-300 rounded px-3 py-2 text-sm bg-slate-50" disabled />
               <Calendar className="absolute right-3 top-2.5 text-slate-400" size={16} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Data de Fim</label>
            <div className="relative">
               <input type="text" placeholder="dd/mm/aaaa" className="w-full border border-slate-300 rounded px-3 py-2 text-sm bg-slate-50" disabled />
               <Calendar className="absolute right-3 top-2.5 text-slate-400" size={16} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- VIEW 4 (COMPLEXA): DETALHES DO JOB ---
function JobDetailView({ job, onBack }: { job: Job, onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<JobTabType>('itens');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header do Job */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-1 hover:bg-slate-100 rounded text-slate-500">
              <ChevronLeft size={20} />
            </button>
            <div>
               <div className="flex items-center gap-2">
                  <LayoutGrid size={16} className="text-slate-400" />
                  <h2 className="font-bold text-lg text-slate-800">{job.title}</h2>
               </div>
            </div>
         </div>
         <button className="flex items-center gap-2 text-indigo-600 text-xs border border-indigo-200 px-3 py-1.5 rounded bg-white hover:bg-indigo-50 font-medium">
            <LinkIcon size={14} /> Link de Aprovação
         </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Lateral */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col py-4">
           <SidebarItem icon={<Search size={18} />} label="Dados do Job" active={activeTab === 'dados'} onClick={() => setActiveTab('dados')} />
           <SidebarItem icon={<LayoutGrid size={18} />} label="Itens do Job" active={activeTab === 'itens'} onClick={() => setActiveTab('itens')} badge={1} />
           <div className="my-2 border-t border-slate-100 mx-4"></div>
           <SidebarItem icon={<CheckCircle2 size={18} />} label="Aprovação" active={activeTab === 'aprovacao'} onClick={() => setActiveTab('aprovacao')} />
           <SidebarItem icon={<Trash2 size={18} />} label="Excluir Job" active={activeTab === 'excluir'} onClick={() => setActiveTab('excluir')} />
           <SidebarItem icon={<Archive size={18} />} label="Arquivar Job" active={activeTab === 'arquivar'} onClick={() => setActiveTab('arquivar')} />
        </aside>

        {/* Conteúdo Principal */}
        <div className="flex-1 p-8 overflow-auto">
          {activeTab === 'dados' && <JobDataTab job={job} />}
          {activeTab === 'itens' && <JobItemsTab onOpenModal={() => setIsModalOpen(true)} />}
          {activeTab === 'aprovacao' && <JobApprovalTab />}
        </div>
      </div>

      {/* Modal Adicionar Item */}
      {isModalOpen && <AddItemModal onClose={() => setIsModalOpen(false)} jobTitle={job.title} />}
    </div>
  );
}

// --- SUB-ABAS DO JOB ---

function JobDataTab({ job }: { job: Job }) {
  return (
    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm max-w-3xl">
      <h3 className="font-semibold text-slate-800 mb-1">Dados do Job</h3>
      <p className="text-xs text-slate-500 mb-6">Insira os dados do Job e selecione o Cliente</p>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Nome do Job</label>
          <input type="text" defaultValue={job.title} className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Cliente</label>
              <div className="relative">
                 <select className="w-full border border-slate-300 rounded px-3 py-2 text-sm appearance-none bg-white">
                    <option>{job.client}</option>
                 </select>
                 <ChevronDown className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" size={14} />
              </div>
           </div>
           <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Membros</label>
              <div className="w-full border border-slate-300 rounded px-2 py-1.5 min-h-[38px] flex items-center">
                 <span className="bg-[#6366F1] text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                   Weslley Almeida Sales <X size={10} className="cursor-pointer" />
                 </span>
              </div>
           </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Descrição</label>
          <textarea className="w-full border border-slate-300 rounded px-3 py-2 text-sm h-24 placeholder:text-slate-300 resize-none" placeholder="Ex: Carrosséis para publicação"></textarea>
        </div>

        <div className="pt-2">
           <button className="bg-[#6366F1] text-white px-6 py-2 rounded text-sm font-medium hover:bg-indigo-700">
             Salvar
           </button>
        </div>
      </div>
    </div>
  );
}

function JobItemsTab({ onOpenModal }: { onOpenModal: () => void }) {
  return (
    <div className="max-w-4xl">
       <div className="flex justify-between items-center mb-6">
          <div>
             <h3 className="font-semibold text-slate-800">Itens do Job</h3>
             <p className="text-xs text-slate-500">Adicione posts, carrosséis, vídeos ou outros entregáveis</p>
          </div>
          <button onClick={onOpenModal} className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded text-sm font-medium hover:bg-emerald-600 shadow-sm shadow-emerald-200">
             <Plus size={16} /> Adicionar Item
          </button>
       </div>

       {/* Timeline */}
       <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 pb-10">
          {MOCK_ITEMS.map((item) => (
            <div key={item.id} className="relative pl-8">
               {/* Bolinha da Timeline */}
               <div className="absolute -left-[9px] top-0 w-4 h-4 bg-[#6366F1] rounded-full border-2 border-white shadow-sm z-10"></div>
               
               <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm mb-4">
                  <div className="flex gap-4">
                     <div className="w-24 h-24 bg-slate-100 rounded-md overflow-hidden relative group">
                        <img src={item.thumbnail} className="w-full h-full object-cover" />
                        <div className="absolute top-1 left-1 bg-orange-100 text-orange-600 text-[10px] font-bold px-1.5 rounded border border-orange-200">
                           {item.status}
                        </div>
                     </div>
                     <div className="flex-1">
                        <div className="flex justify-between items-start">
                           <h4 className="font-bold text-slate-800 text-sm">{item.title}</h4>
                           <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal size={16} /></button>
                        </div>
                        <p className="text-xs text-slate-500 mb-2">{jobTitleFull(item.title, item.version)}</p>
                        
                        <div className="flex items-center gap-3 text-xs font-medium mt-4">
                           <button className="text-[#6366F1] hover:underline">Abrir</button>
                           <button className="text-orange-500 hover:underline">Ver Status</button>
                           <button className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Log de Atividade */}
               <div className="bg-indigo-50/50 rounded-lg p-3 text-xs space-y-3">
                  <div className="flex gap-3">
                     <div className="w-8 h-8 rounded-full bg-[#6366F1] text-white flex items-center justify-center font-bold">WS</div>
                     <div>
                        <p className="font-semibold text-slate-700">Alterou o Item</p>
                        <p className="text-slate-500 flex items-center gap-1">Weslley Almeida Sales <span className="w-1 h-1 bg-slate-300 rounded-full"></span> 15/01/2026 18:43</p>
                     </div>
                  </div>
                  <div className="flex gap-3">
                     <div className="w-8 h-8 rounded-full bg-[#6366F1] text-white flex items-center justify-center font-bold">WS</div>
                     <div>
                        <p className="font-semibold text-slate-700">Cadastrou o Item</p>
                        <p className="text-slate-500 flex items-center gap-1">Weslley Almeida Sales <span className="w-1 h-1 bg-slate-300 rounded-full"></span> 15/01/2026 18:42</p>
                     </div>
                  </div>
               </div>
            </div>
          ))}
       </div>
    </div>
  );
}

function JobApprovalTab() {
  return (
    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm max-w-3xl">
       <h3 className="font-semibold text-slate-800 mb-1">Aprovação</h3>
       <p className="text-xs text-slate-500 mb-6">Configure status e automações</p>

       <div className="space-y-6">
          <div>
             <label className="block text-sm font-semibold text-slate-700 mb-2">Status do Job</label>
             <div className="relative max-w-xs">
                <select className="w-full border border-slate-300 rounded px-3 py-2 text-sm appearance-none bg-white font-medium text-slate-700">
                   <option>Job em Aprovação</option>
                   <option>Job Pendente</option>
                   <option>Job Aprovado</option>
                </select>
                <ChevronDown className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" size={16} />
             </div>
             <p className="text-xs text-red-400 mt-1.5">Todos os itens com status Pendente ou em Alteração entrarão em Aprovação.</p>
          </div>

          <div>
             <label className="block text-sm font-semibold text-slate-700 mb-1">Navegação entre os itens</label>
             <p className="text-xs text-slate-500 mb-2">Os aprovadores poderão ver todos os itens sem aprovar nem pedir ajustes</p>
             <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer transition-colors">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
             </div>
          </div>

          <div>
             <label className="block text-sm font-semibold text-slate-700 mb-1">Enviar notificação para cliente</label>
             <p className="text-xs text-slate-500 mb-2">Os aprovadores serão avisados por E-mail e WhatsApp</p>
             <div className="w-12 h-6 bg-emerald-400 rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
             </div>
             <p className="text-xs text-red-400 mt-1.5">A primeira notificação do Job será enviada via WhatsApp e Email. As demais atualizações serão temporariamente enviadas apenas por e-mail.</p>
          </div>

          <div>
             <label className="block text-sm font-semibold text-slate-700 mb-2">Quantidade de lembretes</label>
             <p className="text-xs text-slate-500 mb-2">Defina por quantos dias os aprovadores deverão ser notificados até deixar um feedback</p>
             <div className="relative max-w-xs">
                <select className="w-full border border-slate-300 rounded px-3 py-2 text-sm appearance-none bg-white">
                   <option>1 dia</option>
                   <option>2 dias</option>
                </select>
                <ChevronDown className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" size={16} />
             </div>
          </div>

          <div className="pt-2">
             <button className="bg-[#6366F1] text-white px-6 py-2 rounded text-sm font-medium hover:bg-indigo-700 shadow-sm shadow-indigo-200">
               Salvar
             </button>
          </div>
       </div>
    </div>
  );
}

// --- MODAL: ADICIONAR ITEM ---
function AddItemModal({ onClose, jobTitle }: { onClose: () => void, jobTitle: string }) {
   return (
      <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center backdrop-blur-sm">
         <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
               <h3 className="font-semibold text-slate-800">Adicionar Item</h3>
               <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto bg-[#F8F9FA]">
               <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-6">
                  <div>
                     <label className="block text-xs font-semibold text-slate-600 mb-1">Título do Item</label>
                     <input type="text" defaultValue="Item 2" className="w-full border border-[#6366F1] rounded px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-[#6366F1] font-medium bg-indigo-50/10" />
                  </div>

                  <div>
                     <label className="block text-xs font-semibold text-slate-600 mb-1">Descrição do Item</label>
                     <textarea className="w-full border border-slate-300 rounded px-3 py-2 text-sm h-24 placeholder:text-slate-400 resize-none" placeholder="Insira a legenda do conteúdo ou recomendações para seu cliente"></textarea>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="border border-indigo-200 rounded-lg p-4 bg-indigo-50/30 relative flex items-center gap-3 cursor-pointer ring-1 ring-indigo-500">
                        <div className="w-4 h-4 rounded-full border-4 border-[#6366F1] bg-white"></div>
                        <div>
                           <p className="text-xs font-bold text-slate-700">Upload dos Arquivos</p>
                           <p className="text-[10px] text-slate-500">JPG, WEBP, PNG, MP4 e PDF com até 100 mb</p>
                        </div>
                     </div>
                     <div className="border border-slate-200 rounded-lg p-4 bg-white relative flex items-center gap-3 cursor-pointer hover:bg-slate-50">
                        <div className="w-4 h-4 rounded-full border border-slate-300 bg-white"></div>
                        <div>
                           <p className="text-xs font-bold text-slate-700">Incorporar Material do Google Drive</p>
                           <p className="text-[10px] text-slate-500">Inserir código de incorporação do seu material.</p>
                        </div>
                     </div>
                  </div>

                  <div>
                     <label className="block text-xs font-semibold text-slate-600 mb-2">Arquivos do Item</label>
                     <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 flex flex-col items-center justify-center text-center bg-slate-50">
                        <p className="text-sm font-semibold text-slate-700 mb-1">Solte os arquivos aqui ou clique para fazer upload</p>
                        <p className="text-[10px] text-slate-400 max-w-xs">Tipos de arquivos permitidos: JPG, JPEG, PNG, WEBP, MP4 e PDF (evite misturar diferentes tipos de arquivos no mesmo envio)</p>
                        <p className="text-[10px] text-slate-400 mt-1">Tamanho máximo permitido: 100MB</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 bg-white flex justify-end gap-3">
               <button onClick={onClose} className="px-4 py-2 border border-slate-200 rounded text-sm text-slate-600 hover:bg-slate-50 font-medium">Cancelar</button>
               <button onClick={onClose} className="px-6 py-2 bg-[#6366F1] text-white rounded text-sm font-medium hover:bg-indigo-700 shadow-sm shadow-indigo-200">Salvar</button>
            </div>
         </div>
      </div>
   )
}


// --- COMPONENTES UI AUXILIARES ---

function TabButton({ isActive, onClick, icon, label }: any) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-1 py-3 text-sm font-medium border-b-2 transition-colors ${isActive ? 'border-pink-600 text-pink-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
      {icon} {label}
    </button>
  );
}

function SidebarItem({ icon, label, active, onClick, badge }: any) {
   return (
      <button onClick={onClick} className={`w-full text-left px-6 py-3 flex items-center justify-between text-sm font-medium transition-colors border-l-4 ${active ? 'bg-indigo-50 text-[#6366F1] border-[#6366F1]' : 'text-slate-500 border-transparent hover:bg-slate-50'}`}>
         <div className="flex items-center gap-3">
            {icon} {label}
         </div>
         {badge && <span className="bg-[#6366F1] text-white text-[10px] px-1.5 py-0.5 rounded font-bold">{badge}</span>}
      </button>
   )
}

// Helper para formatar título
function jobTitleFull(title: string, version: number) {
   return `${title} ↑ 2`;
}
// --- NOVO COMPONENTE: MODAL CRIAR JOB ---
function NewJobModal({ onClose }: { onClose: () => void }) {
  return (
     <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center backdrop-blur-sm">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
           <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <LayoutGrid size={18} className="text-indigo-600"/> Novo Job
              </h3>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
           </div>
           
           <div className="p-6 space-y-4">
              <div>
                 <label className="block text-xs font-semibold text-slate-600 mb-1">Nome do Job</label>
                 <input 
                    type="text" 
                    placeholder="Ex: Campanha Dia das Mães" 
                    className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                    autoFocus
                 />
              </div>

              <div>
                 <label className="block text-xs font-semibold text-slate-600 mb-1">Cliente</label>
                 <div className="relative">
                    <select className="w-full border border-slate-300 rounded px-3 py-2 text-sm appearance-none bg-white text-slate-700">
                       <option value="">Selecione um cliente...</option>
                       {MOCK_CLIENTS.map(c => (
                         <option key={c.id} value={c.id}>{c.name}</option>
                       ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" size={14} />
                 </div>
              </div>

              <div>
                 <label className="block text-xs font-semibold text-slate-600 mb-1">Squad/Responsável</label>
                 <div className="w-full border border-slate-300 rounded px-3 py-2 text-sm bg-slate-50 text-slate-500 cursor-not-allowed">
                    Squad 1 Purple (Você)
                 </div>
              </div>
           </div>

           <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={onClose} 
                className="px-4 py-2 border border-slate-200 rounded text-sm text-slate-600 hover:bg-white hover:border-slate-300 font-medium transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  alert("Job criado com sucesso! (Aqui você conectaria com o Supabase)");
                  onClose();
                }} 
                className="px-6 py-2 bg-[#6366F1] text-white rounded text-sm font-medium hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition-all"
              >
                Criar Job
              </button>
           </div>
        </div>
     </div>
  )
}