import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import {
  Plus, Calendar, User, Clock, CheckCircle2, 
  AlertCircle, History, Trash2, Edit, X 
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// --- Tipos ---
type TaskStatus = 'pendente' | 'em_andamento' | 'concluida';

interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignee: string;
  due_date: string;
  created_at: string;
}

interface HistoryLog {
  id: string;
  message: string;
  created_at: string;
}

// --- Componente Principal ---
export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Partial<Task>>({});
  const [historyLogs, setHistoryLogs] = useState<HistoryLog[]>([]);

  // Carregar tarefas
  const fetchTasks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) console.error('Erro ao buscar:', error);
    else setTasks(data || []);
    setLoading(false);
  };

  // Carregar histórico de uma tarefa específica
  const fetchHistory = async (taskId: string) => {
    const { data } = await supabase
      .from('task_history')
      .select('*')
      .eq('task_id', taskId)
      .order('created_at', { ascending: false });
    setHistoryLogs(data || []);
    setIsHistoryOpen(true);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Salvar (Criar ou Editar)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTask.title) return;

    const taskData = {
      title: currentTask.title,
      description: currentTask.description,
      assignee: currentTask.assignee,
      due_date: currentTask.due_date,
      status: currentTask.status || 'pendente',
    };

    if (currentTask.id) {
      // Update
      await supabase.from('tasks').update(taskData).eq('id', currentTask.id);
    } else {
      // Create
      await supabase.from('tasks').insert([taskData]);
    }

    setIsModalOpen(false);
    setCurrentTask({});
    fetchTasks();
  };

  // Deletar
  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      await supabase.from('tasks').delete().eq('id', id);
      fetchTasks();
    }
  };

  // Mudar Status rápido
  const handleStatusChange = async (task: Task, newStatus: TaskStatus) => {
    await supabase.from('tasks').update({ status: newStatus }).eq('id', task.id);
    fetchTasks();
  };

  const openModal = (task?: Task) => {
    setCurrentTask(task || { status: 'pendente' });
    setIsModalOpen(true);
  };

  // Renderização das Colunas (Kanban Simplificado)
  const renderColumn = (title: string, status: TaskStatus, colorClass: string) => (
    <div className="flex-1 min-w-[300px] bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-violet-100 shadow-sm">
      <h2 className={`font-bold text-lg mb-4 flex items-center gap-2 ${colorClass}`}>
        {status === 'pendente' && <AlertCircle size={20} />}
        {status === 'em_andamento' && <Clock size={20} />}
        {status === 'concluida' && <CheckCircle2 size={20} />}
        {title}
        <span className="ml-auto text-xs bg-white px-2 py-1 rounded-full shadow-sm text-gray-500">
          {tasks.filter(t => t.status === status).length}
        </span>
      </h2>
      
      <div className="space-y-3">
        {tasks.filter(t => t.status === status).map(task => (
          <div key={task.id} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-violet-500 hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-800">{task.title}</h3>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button onClick={() => fetchHistory(task.id)} title="Histórico" className="p-1 hover:bg-violet-100 rounded text-violet-600">
                  <History size={16} />
                </button>
                <button onClick={() => openModal(task)} title="Editar" className="p-1 hover:bg-violet-100 rounded text-violet-600">
                  <Edit size={16} />
                </button>
                <button onClick={() => handleDelete(task.id)} title="Excluir" className="p-1 hover:bg-red-100 rounded text-red-500">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 mb-3 line-clamp-2">{task.description}</p>
            
            <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
              <div className="flex items-center gap-1">
                <User size={14} className="text-violet-400" />
                {task.assignee || 'Sem resp.'}
              </div>
              {task.due_date && (
                <div className="flex items-center gap-1">
                  <Calendar size={14} className="text-violet-400" />
                  {format(new Date(task.due_date), "dd/MM", { locale: ptBR })}
                </div>
              )}
            </div>

            {/* Ações rápidas de status */}
            <div className="flex gap-2 mt-2 pt-2 border-t border-gray-50">
              {status !== 'pendente' && (
                <button onClick={() => handleStatusChange(task, 'pendente')} className="text-xs text-gray-400 hover:text-violet-600">← Pendente</button>
              )}
              {status !== 'em_andamento' && (
                <button onClick={() => handleStatusChange(task, 'em_andamento')} className="text-xs text-violet-600 hover:font-bold mx-auto">Em Andamento</button>
              )}
              {status !== 'concluida' && (
                <button onClick={() => handleStatusChange(task, 'concluida')} className="text-xs text-gray-400 hover:text-green-600 ml-auto">Concluir →</button>
              )}
            </div>
          </div>
        ))}
        {tasks.filter(t => t.status === status).length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-violet-100 rounded-lg">
            Nenhuma tarefa aqui
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-violet-50 text-gray-800 font-sans p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-violet-900">Gerenciador de Tarefas</h1>
            <p className="text-violet-600 mt-1">Organize seus projetos com facilidade</p>
          </div>
          <button 
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-lg shadow-lg shadow-violet-200 transition-all active:scale-95"
          >
            <Plus size={20} /> Nova Tarefa
          </button>
        </header>

        {loading ? (
          <div className="text-center py-20 text-violet-500 animate-pulse">Carregando tarefas...</div>
        ) : (
          <div className="flex flex-col md:flex-row gap-6 overflow-x-auto pb-4">
            {renderColumn('A Fazer', 'pendente', 'text-yellow-600')}
            {renderColumn('Em Execução', 'em_andamento', 'text-blue-600')}
            {renderColumn('Finalizado', 'concluida', 'text-green-600')}
          </div>
        )}

        {/* --- Modal de Criação/Edição --- */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-violet-50">
                <h3 className="font-bold text-violet-900">{currentTask.id ? 'Editar Tarefa' : 'Nova Tarefa'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500"><X size={20}/></button>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                  <input 
                    required 
                    value={currentTask.title || ''}
                    onChange={e => setCurrentTask({...currentTask, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="Ex: Atualizar Landing Page"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Responsável</label>
                    <input 
                      value={currentTask.assignee || ''}
                      onChange={e => setCurrentTask({...currentTask, assignee: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                      placeholder="Nome"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Prazo</label>
                    <input 
                      type="datetime-local"
                      value={currentTask.due_date ? new Date(currentTask.due_date).toISOString().slice(0, 16) : ''}
                      onChange={e => setCurrentTask({...currentTask, due_date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                  <textarea 
                    rows={3}
                    value={currentTask.description || ''}
                    onChange={e => setCurrentTask({...currentTask, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                    placeholder="Detalhes da tarefa..."
                  />
                </div>

                <div className="pt-2">
                  <button type="submit" className="w-full bg-violet-600 hover:bg-violet-700 text-white font-medium py-2 rounded-lg transition-colors">
                    Salvar Tarefa
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* --- Modal de Histórico --- */}
        {isHistoryOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-violet-50">
                <h3 className="font-bold text-violet-900 flex items-center gap-2">
                  <History size={18}/> Histórico de Alterações
                </h3>
                <button onClick={() => setIsHistoryOpen(false)} className="text-gray-400 hover:text-red-500"><X size={20}/></button>
              </div>
              <div className="p-6 overflow-y-auto space-y-4">
                {historyLogs.length === 0 ? (
                  <p className="text-center text-gray-400 text-sm">Nenhum registro encontrado.</p>
                ) : (
                  historyLogs.map(log => (
                    <div key={log.id} className="flex gap-3 text-sm">
                      <div className="mt-1 min-w-[8px] h-2 rounded-full bg-violet-300"></div>
                      <div>
                        <p className="text-gray-800">{log.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {format(new Date(log.created_at), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}