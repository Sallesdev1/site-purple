import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  PieChart,
  Box,
  Store,
  Users,
  Settings,
  Truck,
  Globe,
  Search,
  Bell,
  Filter,
  Download,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  Zap,
  Power,
  Moon,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import type { hover } from 'framer-motion';

// --- TYPES & INTERFACES ---

interface Transaction {
  id: string;
  product: string;
  company: string;
  amount: string;
  date: string;
  status: 'Processing' | 'Success' | 'Declined';
  user: string;
  email: string;
  avatar: string;
}

interface CountryStat {
  country: string;
  percentage: number;
  flag: string; // Emoji for simplicity
}

// --- MOCK DATA ---

const chartData = [
  { name: 'Q1', revenue: 4000, target: 2400 },
  { name: 'Q2', revenue: 3000, target: 1398 },
  { name: 'Q3', revenue: 2000, target: 8000 },
  { name: 'Q4', revenue: 2780, target: 3908 },
  { name: 'Q5', revenue: 1890, target: 4800 },
  { name: 'Q6', revenue: 2390, target: 3800 },
  { name: 'Q7', revenue: 3490, target: 4300 },
  { name: 'Q8', revenue: 5000, target: 6000 },
];

const transactions: Transaction[] = [
  { id: '1', product: 'TSLA', company: 'Tesla, Inc.', amount: '$30,021.23', date: 'Dec 13, 2023', status: 'Processing', user: 'Olivia Rhye', email: 'olivia@company.com', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', product: 'MTCH', company: 'Match Group, Inc.', amount: '$10,045.00', date: 'Dec 13, 2023', status: 'Success', user: 'Phoenix Baker', email: 'phoenix@company.com', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', product: 'DDOG', company: 'Datadog Inc.', amount: '$40,132.18', date: 'Dec 13, 2023', status: 'Success', user: 'Lana Steiner', email: 'lana@company.com', avatar: 'https://i.pravatar.cc/150?u=3' },
  { id: '4', product: 'ARKG', company: 'ARK Genomic Revolution', amount: '$22,665.12', date: 'Dec 28, 2023', status: 'Declined', user: 'Demi Wilkinson', email: 'demi@company.com', avatar: 'https://i.pravatar.cc/150?u=4' },
];

const countryStats: CountryStat[] = [
  { country: 'Tennis Lounge', percentage: 85, flag: 'TL' },
  { country: 'Rotha Fitness', percentage: 70, flag: 'RT' },
  { country: 'Ponto Zero', percentage: 45, flag: 'PZ' },
  { country: 'Riplay Sports', percentage: 38, flag: 'RP' },
];

// --- COMPONENTS ---

const SidebarItem = ({ icon: Icon, text, active = false, hasSubmenu = false, isOpen = true }: any) => (
  <div className={`
    flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors mb-1
    ${active ? 'bg-[#7C3AED] text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}
  `}>
    <div className="flex items-center gap-3">
      <Icon size={18} />
      {isOpen && <span className="text-sm font-medium">{text}</span>}
    </div>
    {hasSubmenu && isOpen && <ChevronDown size={14} />}
  </div>
);

const MetricCard = ({ title, value, change, isMain = false, icon: Icon }: any) => {
  const isPositive = change > 0;

  return (
    <div className={`
      relative p-6 rounded-2xl border border-white/5
      ${isMain ? 'bg-gradient-to-br from-[#6D28D9] to-[#4C1D95] text-white' : 'bg-[#1A1D21] text-white'}
    `}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-lg ${isMain ? 'bg-white/20' : 'bg-[#25282C]'}`}>
          <Icon size={20} className={isMain ? 'text-white' : 'text-[#8B5CF6]'} />
        </div>
        <MoreHorizontal size={20} className="text-gray-400 cursor-pointer" />
      </div>

      <div>
        <p className={`text-sm mb-1 ${isMain ? 'text-gray-200' : 'text-gray-400'}`}>{title}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-bold">{value}</h3>
          <span className={`
            text-xs font-medium px-1.5 py-0.5 rounded flex items-center gap-0.5
            ${isMain ? 'bg-white/20 text-white' : (isPositive ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10')}
          `}>
            {isPositive ? '+' : ''}{change}%
          </span>
        </div>
        <p className={`text-xs mt-2 ${isMain ? 'text-gray-300' : 'text-gray-500'}`}>Compared to last month</p>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    Processing: 'text-orange-400',
    Success: 'text-green-400',
    Declined: 'text-red-400'
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`w-1.5 h-1.5 rounded-full bg-current ${styles[status as keyof typeof styles]}`} />
      <span className={styles[status as keyof typeof styles]}>{status}</span>
    </div>
  );
};

// --- MAIN LAYOUT ---

export default function DarkDashboard() {
  return (
    <div className="flex min-h-screen bg-[#0D0F12] text-gray-300 font-sans selection:bg-purple-500 selection:text-white">

      {/* SIDEBAR */}
      <aside className="w-64 border-r border-white/5 bg-[#0D0F12] flex flex-col p-4 fixed h-full z-20">
        {/* Substitua o código antigo por este bloco */}
        <div className="mb-8 px-2">
          <a href="/#" className="inline-block cursor-pointer hover:opacity-80 transition-opacity">
            {/* Removi a div extra e apliquei tamanho direto na imagem */}
            {/* h-12 (48px) é uma altura boa para logos. w-auto mantém a proporção */}
            <img
              src="./images/logo-purple.svg"
              alt="purple logo"
              className="h-12 w-auto object-contain"
            />
          </a>
        </div>

        <nav className="space-y-1 flex-1">
          <SidebarItem icon={LayoutDashboard} text="Dashboard" active />
          <Link to="/tarefas" style={{ textDecoration: 'none', color: 'inherit' }}>
            <SidebarItem icon={ShoppingCart} text="Criações" />
          </Link>
          <SidebarItem icon={PieChart} text="Analytics" hasSubmenu />
          <div className="pl-4 space-y-1 mt-1">
            <SidebarItem icon={Box} text="Product" />
            <SidebarItem icon={Store} text="Store" />
            <SidebarItem icon={Users} text="Visitor" />
          </div>
          <div className="mt-4 mb-2 text-xs font-semibold text-gray-500 px-3 uppercase">Management</div>
          <SidebarItem icon={Zap} text="Enrich" />
          <SidebarItem icon={Truck} text="Shipment" />
          <SidebarItem icon={Globe} text="Integration" />
        </nav>

        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between px-2 py-2">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Moon size={16} /> Dark Mode
          </div>
          <div className="w-8 h-4 bg-[#7C3AED] rounded-full relative cursor-pointer">
            <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow-sm"></div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-64 p-8 max-w-[1600px] mx-auto">

        {/* HEADER */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <div className="flex items-center gap-6 mt-4 text-sm font-medium border-b border-white/5 w-full">
              <span className="text-white border-b-2 border-[#7C3AED] pb-2 cursor-pointer">Overview</span>
              <span className="text-gray-500 pb-2 cursor-pointer hover:text-gray-300">Notifications</span>
              <span className="text-gray-500 pb-2 cursor-pointer hover:text-gray-300">Trade history</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="text"
                placeholder="Search..."
                className="bg-[#1A1D21] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#7C3AED] w-64 text-white placeholder-gray-600"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 text-xs border border-gray-700 px-1.5 rounded">⌘/</div>
            </div>

            <button className="p-2 text-gray-400 hover:text-white"><Power size={18} /></button>
            <button className="p-2 text-gray-400 hover:text-white relative">
              <Bell size={18} />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0D0F12]"></span>
            </button>

            <div className="flex items-center gap-3 border-l border-white/10 pl-4">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-white">28 Aug - 15 Dec, 2024</p>
              </div>
              <button className="flex items-center gap-2 bg-[#1A1D21] border border-white/10 px-3 py-2 rounded-lg text-sm text-white hover:bg-[#25282C]">
                <Filter size={16} /> Filter
              </button>
              <button className="bg-[#7C3AED] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#6D28D9] transition">
                Share
              </button>
              <img src="./board.image/foto-weslley.jpeg" alt="Profile" className="w-9 h-9 rounded-full border border-white/10" />
            </div>
          </div>
        </header>

        {/* METRICS GRID */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Income"
            value="R$348.261,00"
            change={12.05}
            isMain={true}
            icon={ShoppingCart}
          />
          <MetricCard
            title="Profit"
            value="R$15,708.98"
            change={-8.12}
            icon={TrendingUp}
          />
          <MetricCard
            title="Total Revenue"
            value="R$7,415.644"
            change={-1.50}
            icon={Zap}
          />
          <MetricCard
            title="Total Conversion"
            value="10,87%"
            change={35.40}
            icon={PieChart}
          />
        </div>

        {/* CHARTS SECTION */}
        <div className="grid grid-cols-3 gap-6 mb-8">

          {/* Main Line Chart */}
          <div className="col-span-2 bg-[#1A1D21] p-6 rounded-2xl border border-white/5">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-white">Analytic</h2>
              <div className="flex items-center gap-2">
                <button className="text-xs bg-[#25282C] text-gray-300 px-3 py-1.5 rounded-lg flex items-center gap-2 border border-white/5">
                  Sales Estimation <ChevronDown size={12} />
                </button>
                <MoreHorizontal className="text-gray-500" size={18} />
              </div>
            </div>

            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FBBF24" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#FBBF24" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} tickFormatter={(value) => `$${value / 1000}M`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                  <Area type="monotone" dataKey="target" stroke="#FBBF24" strokeWidth={2} fillOpacity={1} fill="url(#colorTarget)" />
                  {/* Vertical dashed line simulation */}
                  <ReferenceLine x="Q5" stroke="#6B7280" strokeDasharray="3 3" />
                </AreaChart>
              </ResponsiveContainer>

              {/* Custom Tooltip Overlay Simulation */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#25282C]/90 backdrop-blur-sm p-3 rounded-xl border border-white/10 shadow-xl hidden md:block">
                <div className="text-xs text-gray-400 mb-1">Nov 21, 2023</div>
                <div className="flex gap-4">
                  <div>
                    <div className="text-[10px] text-gray-500">Revenue</div>
                    <div className="font-bold text-white text-sm border-l-2 border-[#8B5CF6] pl-1.5">$32,839.99</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500">Target</div>
                    <div className="font-bold text-white text-sm border-l-2 border-[#FBBF24] pl-1.5">$18,100.00</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Country Stats */}
          <div className="col-span-1 bg-[#1A1D21] p-6 rounded-2xl border border-white/5 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg font-bold text-white">Session by Country</h2>
              <MoreHorizontal className="text-gray-500" size={18} />
            </div>

            <div className="space-y-6">
              {countryStats.map((stat) => (
                <div key={stat.country}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-300 flex items-center gap-2">
                      <span className="text-lg">{stat.flag}</span> {stat.country}
                    </span>
                    <span className="font-bold text-white">{stat.percentage}%</span>
                  </div>
                  <div className="h-2 w-full bg-[#25282C] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#7C3AED] rounded-full"
                      style={{ width: `${stat.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TRANSACTIONS TABLE */}
        <div className="bg-[#1A1D21] rounded-2xl border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h2 className="text-lg font-bold text-white">Transaction History</h2>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 text-sm text-gray-300 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:bg-[#25282C]">
                <Download size={14} /> Download
              </button>
              <button className="flex items-center gap-2 text-sm text-white bg-[#7C3AED] hover:bg-[#6D28D9] px-3 py-1.5 rounded-lg shadow-lg shadow-purple-900/20">
                <Zap size={14} /> Re-issue
              </button>
              <button className="p-1.5 text-gray-400 border border-white/10 rounded-lg hover:bg-[#25282C]">
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="text-xs uppercase bg-[#141619] text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-medium"><input type="checkbox" className="rounded bg-[#25282C] border-gray-700" /></th>
                  <th className="px-6 py-4 font-medium">Product Name</th>
                  <th className="px-6 py-4 font-medium">Order amount</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Executed by</th>
                  <th className="px-6 py-4 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-[#1F2226] transition-colors">
                    <td className="px-6 py-4"><input type="checkbox" className="rounded bg-[#25282C] border-gray-700" /></td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium">{t.product}</p>
                        <p className="text-xs text-gray-500">{t.company}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white font-medium">{t.amount}</td>
                    <td className="px-6 py-4">{t.date}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={t.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={t.avatar} alt="" className="w-8 h-8 rounded-full" />
                        <div>
                          <p className="text-white text-xs font-medium">{t.user}</p>
                          <p className="text-[10px] text-gray-500">{t.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-500 hover:text-white flex items-center gap-1 text-xs border border-white/10 px-2 py-1 rounded">
                        More <ChevronDown size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}