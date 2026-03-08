# Atividade Pratica - Pomodoro + Task List (React)

Este projeto foi desenvolvido como desafio pratico da aula para consolidar conceitos de React e evoluir o exercicio de Todo List com um Pomodoro funcional.

## Estrutura atual do projeto

O app foi separado em 3 arquivos principais:

- `src/TaskList.tsx`
	- Componente principal da aplicacao
	- Controla a navegacao entre telas
	- Renderiza a tela de tarefas
	- Inicia por padrao em `Task List`
- `src/PomodoroTimer.tsx`
	- Contem toda a logica e interface do Pomodoro
- `src/TopBar.tsx`
	- Contem a barra superior com as abas `Task List` e `Pomodoro`

No `src/main.tsx`, o projeto importa `TaskList.tsx` como entrada principal.

## O que foi implementado

1. Task List (Todo List) aprimorada
- Adicionar tarefa
- Remover tarefa com confirmacao
- Marcar tarefa como concluida
- Validar input (so adiciona se houver texto)
- Adicionar tarefa ao pressionar `Enter`
- Exibir contador de tarefas concluidas
- Alertas com `SweetAlert2`:
	- aviso quando o campo esta vazio
	- sucesso quando a tarefa e adicionada
	- confirmacao antes de remover
	- sucesso apos remover

2. Pomodoro Timer
- Modos de tempo:
	- `Focus`: 25 minutos
	- `Short Break`: 5 minutos
	- `Long Break`: 15 minutos
- Botoes de controle: `Start/Pause` e `Reset`
- Troca manual de modo
- Troca automatica ao finalizar o tempo:
	- ao finalizar `Focus`, vai para break (curto ou longo)
	- a cada 4 ciclos de foco, entra `Long Break`
- Cor do timer por modo:
	- focus: rosa/vermelho
	- short break: verde
	- long break: azul claro

3. Top bar de navegacao
- Abas `Task List` e `Pomodoro`
- Exibe apenas uma tela por vez, conforme a aba selecionada
- Tela inicial ao abrir localhost: `Task List`

## Conceitos React usados

### Component
Componentes sao blocos reutilizaveis de interface.

Exemplos neste projeto:
- `TaskList` (componente principal)
- `PomodoroTimer` (responsavel pelo timer)
- `TopBar` (responsavel pelas abas)
- `TabButton` (botao reutilizavel)

### Props
Props sao dados/funcoes passados de um componente pai para um componente filho.

Exemplos neste projeto:
- `TopBar` recebe `activeScreen` e `onChangeScreen`
- `TabButton` recebe `isActive`, `label` e `onClick`

### React State
State e a memoria local do componente (dados que mudam com interacao do usuario).

Exemplos neste projeto:
- `input`, `tasks` e `activeScreen` em `TaskList`
- `mode`, `timeLeftInSeconds`, `isRunning` e `focusSessionsDone` em `PomodoroTimer`

### React Hooks
Hooks sao funcoes especiais do React para adicionar comportamento em componentes funcionais.

Hooks usados:
- `useState`
- `useMemo`
- `useEffect`
- `useCallback`

### useEffect
`useEffect` foi usado no Pomodoro para controlar o ciclo de vida do timer.

- quando `isRunning` fica `true`, o efeito cria um intervalo de 1 segundo
- quando para o timer ou desmonta o componente, o intervalo e limpo

### useCallback
`useCallback` foi usado para memorizar funcoes e manter referencia estavel entre renders.

Exemplos:
- `addTask`, `toggleTaskCompleted` e `removeTask` em `TaskList`
- `switchMode` e `handleTimerFinished` em `PomodoroTimer`

### setInterval
`setInterval` foi usado para decrementar o tempo do Pomodoro a cada 1 segundo.

Fluxo resumido:
1. Inicia ao clicar em `Start`
2. Diminui `timeLeftInSeconds` de 1 em 1
3. Quando chega em `0`, finaliza o modo atual e troca para o proximo modo
4. O intervalo e limpo com `clearInterval` no cleanup do `useEffect`

## Como executar

No terminal, dentro da pasta do projeto:

```bash
pnpm install
pnpm dev
```

Abra o endereco informado no terminal (geralmente `http://localhost:5173`).

## Build de producao

```bash
pnpm build
pnpm preview
```

