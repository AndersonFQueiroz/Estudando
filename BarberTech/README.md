# 💈 BarberTech - Sistema de Gestão Inteligente

> Um SaaS moderno e inteligente para gestão de agendamentos, clientes e faturamento de barbearias, construído com React.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer&logoColor=blue)

## 💻 Sobre o Projeto

O **BarberTech** nasceu da necessidade de modernizar a gestão de barbearias. Abandonando a velha agenda de papel, este sistema oferece uma interface *High-Tech/Neon* extremamente intuitiva. O aplicativo não apenas anota horários, mas atua como um assistente real: calcula faturamento, bloqueia conflitos de agenda e facilita o contato direto com o cliente.

## 🚀 Principais Funcionalidades

- **📅 Calendário Inteligente (Anti-Overbooking):** Seletor de datas e horas customizado que bloqueia automaticamente datas no passado.
- **👥 Gestão de Capacidade e Tempo:** O sistema calcula a disponibilidade de horários baseando-se no número de barbeiros ativos e na duração exata de cada serviço (ex: Luzes = 120min).
- **📱 Integração Nativa com WhatsApp:** Botão inteligente que formata o número do cliente e abre o WhatsApp com uma mensagem de lembrete pré-configurada. Possui alerta automático de "Avisar 2H" quando o agendamento está próximo.
- **📊 Dashboard Financeiro Dinâmico:** Gráficos interativos interligados aos agendamentos, com filtros de faturamento por período (Hoje, Mês, Histórico Completo).
- **🛡️ UX Resiliente e Máscaras:** Campos de formulário com máscaras (Regex) automáticas para telefone e bloqueios de interação em cascata (não é possível escolher a data sem antes definir o serviço).
- **🎨 UI Premium:** Design construído do zero com *Glassmorphism*, efeitos de brilho neon (Glow) e animações de interface fluidas.

## 🛠️ Tecnologias e Conceitos Aplicados

- **Core:** React.js (Lógica pesada com `useState` e `useEffect`)
- **Manipulação de Dados:** Map, Filter, Reduce e lógica avançada de manipulação de Datas no JavaScript.
- **Ferramentas Visuais:** Vanilla CSS avançado, *Framer Motion* para animações de montagem de lista e *Recharts* para os gráficos.
- **Armazenamento:** `localStorage` nativo (Preparado para migração para Banco de Dados Nuvem).

## ⚙️ Como Executar Localmente

1. Clone este repositório para sua máquina.
2. Acesse a pasta do projeto no terminal:
   ```bash
   cd BarberTech
   ```
3. Instale as dependências essenciais:
   ```bash
   npm install
   ```
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## 📸 Showcase
- Em Breve!

---
*Desenvolvido como projeto de estudo e evolução arquitetural em React.*

## 🗺️ Roadmap de Evolução

O projeto segue em desenvolvimento ativo, com as seguintes metas de curto e médio prazo:

- [ ] **Integração com Supabase:** Migração do armazenamento para Banco de Dados SQL em nuvem com sincronização em tempo real.
- [ ] **Suporte PWA:** Transformação da aplicação em um Progressive Web App instalável em dispositivos móveis e desktop.
- [ ] **Autenticação de Usuários:** Sistema de login seguro para barbeiros e administradores.
- [ ] **Relatórios Avançados:** Exportação de dados financeiros mensais e estatísticas de retenção de clientes.
- [ ] **Deploy na Vercel:** Hospedagem oficial para acesso via URL pública.