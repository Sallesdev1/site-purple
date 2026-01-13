import { supabase } from '../supabaseClient';
import React, { useState, useRef } from 'react';
import {
    Layout,
    Plus,
    MoreVertical,
    Calendar,
    Paperclip,
    CheckCircle2,
    Circle,
    Clock,
    UploadCloud,
    FileText,
    X,
    Search,
    Filter,
    ChevronDown
} from 'lucide-react';

// --- TYPES (TypeScript) ---

type Status = 'todo' | 'in_progress' | 'done';
type Priority = 'low' | 'medium' | 'high';

interface Attachment {
    id: string;
    name: string;
    url: string;
    size: string;
}

interface Task {
    id: string;
    title: string;
    description: string;
    status: Status;
    priority: Priority;
    dueDate: string;
    assignee: string; // URL do avatar
    attachments: Attachment[];
}

interface Project {
    id: string;
    name: string;
    active: boolean;
}

// --- MOCK DATA (Dados iniciais) ---

const initialProjects: Project[] = [
    { id: '1', name: 'VÍDEO | TESTE 1', active: true },
    { id: '2', name: 'EST | TESTE 2', active: false },
    { id: '3', name: 'EST | TESTE 3', active: false },
];

const initialTasks: Task[] = [
    {
        id: '1',
        title: 'VÍDEO | TESTE 1',
        description: 'CRIANDO UM TESTE',
        status: 'done',
        priority: 'high',
        dueDate: '2026-01-13',
        assignee: './public/board.image/foto-weslley.jpeg',
        attachments: [{ id: 'a1', name: 'wireframe_v1.fig', url: '#', size: '2.4 MB' }]
    },
    {
        id: '2',
        title: 'EST | TESTE 2',
        description: 'CRIANDO UM TESTE',
        status: 'in_progress',
        priority: 'low',
        dueDate: '2023-10-28',
        assignee: 'https://i.pravatar.cc/150?u=2',
        attachments: []
    },
    {
        id: '3',
        title: 'EST | TESTE 3',
        description: 'CRIANDO UM TESTE',
        status: 'todo',
        priority: 'medium',
        dueDate: '2026-01-10',
        assignee: 'https://i.pravatar.cc/150?u=3',
        attachments: []
    },
];

// --- COMPONENTS ---

const PriorityBadge = ({ priority }: { priority: Priority }) => {
    const styles = {
        low: 'bg-blue-500/10 text-blue-400',
        medium: 'bg-orange-500/10 text-orange-400',
        high: 'bg-red-500/10 text-red-400',
    };
    return (
        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${styles[priority]}`}>
            {priority}
        </span>
    );
};

export default function TeamManager() {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [projects, setProjects] = useState<Project[]>(initialProjects);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Refs para o formulário
    const titleRef = useRef<HTMLInputElement>(null);
    const descRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- ACTIONS ---

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!titleRef.current?.value) return;

        let uploadedFileUrl = '';

        // Lógica de Upload REAL
        if (fileInputRef.current?.files?.length) {
            const file = fileInputRef.current.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `uploads/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('documents')
                .upload(filePath, file);

            if (uploadError) {
                alert('Erro no upload!');
                return;
            }

            const { data } = supabase.storage.from('documents').getPublicUrl(filePath);
            uploadedFileUrl = data.publicUrl;
        }

        // Lógica de Salvar no Banco REAL
        const { error: dbError } = await supabase
            .from('tasks')
            .insert([
                {
                    title: titleRef.current.value,
                    description: descRef.current?.value,
                    status: 'todo',
                    file_url: uploadedFileUrl
                }
            ]);

        if (!dbError) {
            alert('Tarefa criada com sucesso!');
            setIsModalOpen(false);
            // Dica: Aqui você precisaria criar uma função para recarregar a lista 'tasks'
        }
    };

    const moveTask = (id: string, newStatus: Status) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
    };

    const handleDelete = (id: string) => {
        setTasks(tasks.filter(t => t.id !== id));
    };

    // --- RENDER HELPERS ---

    const renderColumn = (title: string, status: Status, icon: any, colorClass: string) => {
        const columnTasks = tasks.filter(t => t.status === status);
        const Icon = icon;

        return (
            <div className="flex-1 min-w-[300px] bg-[#1A1D21] rounded-xl p-4 flex flex-col h-full border border-white/5">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${colorClass} bg-opacity-20`}>
                            <Icon size={16} className={colorClass.replace('bg-', 'text-')} />
                        </div>
                        <h3 className="font-bold text-gray-200">{title}</h3>
                        <span className="text-xs font-medium text-gray-500 bg-[#25282C] px-2 py-0.5 rounded-full">
                            {columnTasks.length}
                        </span>
                    </div>
                    <Plus size={18} className="text-gray-500 cursor-pointer hover:text-white" onClick={() => setIsModalOpen(true)} />
                </div>

                <div className="space-y-3 overflow-y-auto flex-1 pr-1 custom-scrollbar">
                    {columnTasks.map(task => (
                        <div key={task.id} className="bg-[#25282C] p-4 rounded-xl border border-white/5 hover:border-[#7C3AED]/50 transition-all group shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <PriorityBadge priority={task.priority} />
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                    <button onClick={() => handleDelete(task.id)} className="text-gray-500 hover:text-red-400">
                                        <X size={14} />
                                    </button>
                                    {/* Simples dropdown de mover para demonstração */}
                                    {status !== 'done' && (
                                        <button onClick={() => moveTask(task.id, status === 'todo' ? 'in_progress' : 'done')} className="text-gray-500 hover:text-green-400">
                                            <ChevronDown size={14} className="-rotate-90" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <h4 className="font-semibold text-gray-200 mb-1">{task.title}</h4>
                            <p className="text-xs text-gray-500 mb-3 line-clamp-2">{task.description}</p>

                            {/* Attachments Area */}
                            {task.attachments.length > 0 && (
                                <div className="mb-3 space-y-1">
                                    {task.attachments.map(att => (
                                        <div key={att.id} className="flex items-center gap-2 text-xs text-blue-400 bg-blue-400/5 p-1.5 rounded border border-blue-400/10">
                                            <Paperclip size={12} />
                                            <span className="truncate max-w-[150px]">{att.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Calendar size={14} />
                                    <span>{new Date(task.dueDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
                                </div>
                                <img src={task.assignee} alt="Assignee" className="w-6 h-6 rounded-full border border-[#1A1D21]" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="flex h-screen bg-[#0D0F12] text-gray-300 font-sans overflow-hidden">

            {/* SIDEBAR */}
            <aside className="w-64 border-r border-white/5 bg-[#0D0F12] flex flex-col p-4 hidden md:flex">
                <div className="mb-8 px-2">
                    <a href="/board" className="inline-block cursor-pointer hover:opacity-80 transition-opacity">
                        {/* Removi a div extra e apliquei tamanho direto na imagem */}
                        {/* h-12 (48px) é uma altura boa para logos. w-auto mantém a proporção */}
                        <img
                            src="./images/logo-purple.svg"
                            alt="purple logo"
                            className="h-12 w-auto object-contain"
                        />
                    </a>
                </div>

                <div className="mb-6">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-colors"
                    >
                        <Plus size={16} /> Nova Tarefa
                    </button>
                </div>

                <nav className="space-y-1 flex-1">
                    <h3 className="text-xs font-bold text-gray-500 px-3 mb-2 uppercase tracking-wider">Projetos</h3>
                    {projects.map(p => (
                        <div
                            key={p.id}
                            className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${p.active ? 'bg-white/5 text-white' : 'hover:bg-white/5'}`}
                            onClick={() => setProjects(projects.map(proj => ({ ...proj, active: proj.id === p.id })))}
                        >
                            <span className="text-sm font-medium truncate">{p.name}</span>
                            {p.active && <div className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]"></div>}
                        </div>
                    ))}
                </nav>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 flex flex-col min-w-0">

                {/* HEADER */}
                <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#0D0F12]">
                    <h1 className="text-xl font-bold text-white">
                        {projects.find(p => p.active)?.name || 'Dashboard'}
                    </h1>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input type="text" placeholder="Buscar tarefas..." className="bg-[#1A1D21] border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-[#7C3AED] w-48 transition-all" />
                        </div>
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <img key={i} src={`https://i.pravatar.cc/150?u=${i}`} className="w-8 h-8 rounded-full border-2 border-[#0D0F12]" />
                            ))}
                            <div className="w-8 h-8 rounded-full bg-[#25282C] border-2 border-[#0D0F12] flex items-center justify-center text-xs font-bold text-gray-400">+2</div>
                        </div>
                    </div>
                </header>

                {/* KANBAN BOARD */}
                <div className="flex-1 overflow-x-auto p-6">
                    <div className="flex gap-6 h-full min-w-[1000px]">
                        {renderColumn('A Fazer', 'todo', Circle, 'bg-gray-500 text-gray-500')}
                        {renderColumn('Em Progresso', 'in_progress', Clock, 'bg-orange-500 text-orange-500')}
                        {renderColumn('Concluído', 'done', CheckCircle2, 'bg-green-500 text-green-500')}
                    </div>
                </div>
            </main>

            {/* MODAL DE CRIAÇÃO & UPLOAD */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#1A1D21] w-full max-w-md rounded-2xl border border-white/10 shadow-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-white">Nova Tarefa</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white"><X size={20} /></button>
                        </div>

                        <form onSubmit={handleCreateTask} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Título</label>
                                <input ref={titleRef} required type="text" className="w-full bg-[#0D0F12] border border-white/10 rounded-lg p-2.5 text-white text-sm focus:border-[#7C3AED] focus:outline-none" placeholder="Ex: Revisar contrato" />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Descrição</label>
                                <textarea ref={descRef} className="w-full bg-[#0D0F12] border border-white/10 rounded-lg p-2.5 text-white text-sm focus:border-[#7C3AED] focus:outline-none h-24 resize-none" placeholder="Detalhes da tarefa..." />
                            </div>

                            {/* UPLOAD AREA */}
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1">Anexar Trabalho/Arquivo</label>
                                <div className="relative border-2 border-dashed border-white/10 hover:border-[#7C3AED]/50 rounded-lg bg-[#0D0F12] transition-colors group">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        onChange={() => setUploading(true)} // Apenas visual
                                    />
                                    <div className="p-4 flex flex-col items-center justify-center text-gray-500 group-hover:text-[#7C3AED]">
                                        <UploadCloud size={24} className="mb-2" />
                                        <span className="text-xs">{uploading ? 'Arquivo selecionado!' : 'Clique ou arraste o arquivo aqui'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-transparent border border-white/10 text-gray-300 py-2.5 rounded-lg text-sm hover:bg-white/5">Cancelar</button>
                                <button type="submit" className="flex-1 bg-[#7C3AED] hover:bg-[#6D28D9] text-white py-2.5 rounded-lg text-sm font-medium">Criar Tarefa</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}