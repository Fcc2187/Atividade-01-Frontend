# Atividade Pratica - Pomodoro + Task List (React)

Este projeto foi desenvolvido como desafio pratico da aula para consolidar conceitos de React e evoluir o exercicio de Todo List com um Pomodoro funcional.

## O que foi feito

1. **Task List (Todo List) aprimorada**
- Adicionar tarefa
- Remover tarefa
- Marcar tarefa como concluida
- Validar input (so adiciona se houver texto)
- Adicionar tarefa ao pressionar `Enter`
- Exibir contador de tarefas concluidas
- Alertas com **SweetAlert2**:
	- aviso quando o campo esta vazio
	- sucesso quando a tarefa e adicionada

> **Destaque:** implementei o **SweetAlert2** como um extra por ja ter familiaridade com a biblioteca e por considerar que melhoraria a experiencia na parte do Task List, deixando os feedbacks mais claros e visuais.

2. **Pomodoro Timer**
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

3. **Top bar de navegacao**
- Abas `Pomodoro` e `Task List`
- Exibe apenas uma tela por vez, conforme a aba selecionada

## Conceitos React usados na atividade

### Component
Componentes sao blocos reutilizaveis de interface.

Neste projeto, exemplos de componentes:
- `App` (componente principal)
- `PomodoroTimer` (responsavel pelo timer)
- `Tasks` (responsavel pelas tarefas)
- `TabButton` (botao reutilizavel das abas)

Cada componente encapsula sua propria responsabilidade, deixando o codigo mais organizado.

### Props
Props sao dados/funcoes passados de um componente pai para um componente filho.

Exemplo no projeto:
- `TabButton` recebe `isActive`, `label` e `onClick` via props.
- Assim, o mesmo componente de botao pode ser reutilizado em varios contextos (abas da top bar e selecao de modo do Pomodoro).

### React State
State e a memoria local do componente (dados que mudam com interacao do usuario).

Exemplos no projeto:
- `input` e `tasks` no componente `Tasks`
- `mode`, `timeLeftInSeconds` e `isRunning` no `PomodoroTimer`
- `activeScreen` no `App`, para controlar qual tela aparece

Quando o state muda, o React renderiza novamente a interface com os novos valores.

### React Hooks
Hooks sao funcoes especiais do React para adicionar comportamento em componentes funcionais.

Hooks usados:
- `useState`
- `useMemo`
- `useEffect`
- `useCallback`

### useEffect
`useEffect` foi usado para controlar o ciclo de vida do timer.

No Pomodoro:
- quando `isRunning` fica `true`, o efeito cria um intervalo de 1 segundo
- quando para o timer ou desmonta o componente, o intervalo e limpo

Isso evita vazamento de memoria e execucao duplicada de intervalos.

### useCallback
`useCallback` foi usado para memorizar funcoes e manter referencia estavel entre renders.

Exemplos:
- `addTask`, `toggleTaskCompleted` e `removeTask` no Tasks
- `switchMode` e `handleTimerFinished` no Pomodoro

Beneficio: deixa o codigo mais previsivel e evita recriacao desnecessaria de funcoes.

### setInterval
`setInterval` foi usado para decrementar o tempo do Pomodoro a cada 1 segundo.

Fluxo resumido:
1. Inicia ao clicar em `Start`
2. Diminui `timeLeftInSeconds` de 1 em 1
3. Quando chega em 0, finaliza o modo atual e troca para o proximo modo
4. O intervalo e sempre limpo com `clearInterval` no cleanup do `useEffect`

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

