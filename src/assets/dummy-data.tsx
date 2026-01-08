import { UploadIcon, VideoIcon, ZapIcon } from 'lucide-react';

export const featuresData = [
    {
        icon: <UploadIcon className="w-6 h-6" />,
        title: 'Diagnóstico',
        desc: 'Levantaremos juntos, quais são as suas necessidades e quais são as oportunidades que seu marketing pode explorar mais!'
    },
    {
        icon: <ZapIcon className="w-6 h-6" />,
        title: 'Projeto',
        desc: 'Depois de analisar, encontraremos as oportunidades certas e criaremos o projeto que realmente funciona pro seu negócio. O seu projeto é totalmente exclusivo e único para a realidade atual do seu negócio.'
    },
    {
        icon: <VideoIcon className="w-6 h-6" />,
        title: 'Ação',
        desc: 'Hora da mão na massa! Não adiantaria nada te mostrarmos o caminho do ouro se não fossemos atrás dele, com você!'
    }
];

export const plansData = [
    {
        id: 'starter',
        name: 'Starter',
        price: '$499',
        desc: 'Best for early-stage startups.',
        credits: 'One-time',
        features: [
            'Project discovery & planning',
            'UI/UX design',
            'Basic website development',
            '1 revision round',
            'Email support'
        ]
    },
    {
        id: 'pro',
        name: 'Growth',
        price: '$1,499',
        desc: 'Growing teams and businesses.',
        credits: 'Monthly',
        features: [
            'Everything in Starter',
            'Advanced UI/UX design',
            'Custom development',
            'Performance optimization',
            'Priority support'
        ],
        popular: true
    },
    {
        id: 'ultra',
        name: 'Scale',
        price: '$3,999',
        desc: 'For brands ready to scale fast.',
        credits: 'Custom',
        features: [
            'Everything in Growth',
            'Dedicated project manager',
            'Ongoing optimization',
            'Marketing & growth support',
            'Chat + Email support'
        ]
    }
];

export const faqData = [
    {
        question: 'Você não precisa montar um time do zero',
        answer: 'A Purple já tem um time completo de especialistas prontos para atuar. Nada de contratar, treinar e gerenciar equipe interna – você ganha tempo e reduz custos.'
    },
    {
        question: 'Mão na massa',
        answer: 'Planejamento sem execução não dá, né??. Criamos, gerenciamos e otimizamos tudo, garantindo que sua estratégia de marketing saia do papel e traga resultado.'
    },
    {
        question: 'Foco no ouro',
        answer: 'A prioridade é impactar o público certo e gerar oportunidades reais para o seu negócio, sem desperdício de tempo ou dinheiro. Nosso principal objetivo é fazer o seu negócio crescer.'
    },
    {
        question: 'Trampo confiável',
        answer: 'Compromisso, transparência e entrega de qualidade são a base do nosso trabalho. A experiência e os cases da Purple falam por si.'
    },
    {
        question: 'Rapidez e Compromisso',
        answer: 'Nossas demandas são atendidas no tempo certo, sem comprometer a qualidade ou deixar você na mão. A agilidade faz parte do nosso DNA.'
    },
    {
        question: 'Parceiros, não apenas uma assessoria',
        answer: 'A Purple trabalha junto com você, sendo uma extensão do seu time e empresa. O sucesso do seu negócio é o nosso maior objetivo.'
    },
];

export const footerLinks = [
    {
        title: "Navegação",
        links: [
            { name: "Início", url: "#" },
            { name: "Serviços", url: "#" },
            { name: "Trabalhos", url: "#" },
            { name: "Contato", url: "#" }
        ]
    },
    {
        title: "Privacidade",
        links: [
            { name: "Politica de Privacidade", url: "#" },
            { name: "Termos de Serviço", url: "#" }
        ]
    },
    {
        title: "Redes Sociais",
        links: [
            { name: "Instagram", url: "https://www.instagram.com/purple.csc/" },
            { name: "LinkedIn", url: "https://www.linkedin.com/company/purple-csc/?originalSubdomain=br" },
        ]
    }
];