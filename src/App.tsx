import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";

type TimerMode = "focus" | "shortBreak" | "longBreak";
type ActiveScreen = "pomodoro" | "tasks";

type Task = {
  completed: boolean;
  id: string;
  title: string;
};

type TabButtonProps = {
  isActive: boolean;
  label: string;
  onClick: () => void;
};

const MODE_DURATIONS: Record<TimerMode, number> = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

const MODE_LABELS: Record<TimerMode, string> = {
  focus: "Focus",
  shortBreak: "Short Break",
  longBreak: "Long Break",
};

const MODE_TIMER_COLORS: Record<TimerMode, string> = {
  focus: "text-rose-400",
  shortBreak: "text-emerald-400",
  longBreak: "text-sky-300",
};

// Component + Props:
// This reusable button receives data and behavior from its parent via props.
function TabButton({ isActive, label, onClick }: TabButtonProps) {
  return (
    <button
      className={`rounded-full px-4 py-2 text-sm font-semibold transition sm:text-base ${
        isActive
          ? "bg-slate-100 text-slate-900"
          : "text-slate-300 hover:bg-slate-700"
      }`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

// Component:
// Tasks is an isolated UI block responsible only for task management.
function Tasks() {
  // React State:
  // useState stores values that can change over time and trigger re-render.
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  // React Hook (useMemo):
  // Derives a value from state and recalculates only when dependencies change.
  const completedTasks = useMemo(
    () => tasks.filter((task) => task.completed).length,
    [tasks],
  );

  // React Hook (useCallback):
  // Keeps function reference stable across renders for predictable behavior.
  const addTask = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const title = input.trim();

      if (!title) {
        void Swal.fire({
          icon: "warning",
          title: "Empty input",
          text: "Please type a task before adding.",
          confirmButtonText: "OK",
          background: "#0f1b3d",
          color: "#f7f8ff",
        });
        return;
      }

      setTasks((previousTasks) => [
        ...previousTasks,
        { completed: false, id: crypto.randomUUID(), title },
      ]);
      setInput("");

      void Swal.fire({
        icon: "success",
        title: "Task added",
        text: "Your task was added successfully.",
        timer: 1300,
        showConfirmButton: false,
        background: "#0f1b3d",
        color: "#f7f8ff",
      });
    },
    [input],
  );

  const toggleTaskCompleted = useCallback((id: string) => {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  }, []);

  const removeTask = useCallback((id: string) => {
    setTasks((previousTasks) => previousTasks.filter((task) => task.id !== id));
  }, []);

  return (
    <section className="w-full max-w-2xl rounded-3xl border border-slate-700/60 bg-slate-900/50 p-6 shadow-2xl backdrop-blur-sm sm:p-7">
      <header className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-100">Tasks</h2>
        <span className="rounded-full border border-slate-600 px-3 py-1 text-sm text-slate-300">
          {completedTasks}/{tasks.length} completed
        </span>
      </header>

      <form className="mb-5 flex gap-3" onSubmit={addTask}>
        <input
          className="w-full rounded-xl border border-slate-600 bg-slate-800/70 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-400 focus:border-cyan-300"
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Add a task..."
        />

        <button
          className="rounded-xl bg-slate-100 px-6 py-3 font-semibold text-slate-900 transition hover:bg-cyan-200"
          type="submit"
        >
          Add
        </button>
      </form>

      {tasks.length === 0 ? (
        <p className="text-center text-slate-400">No tasks yet</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-800/70 px-4 py-3"
              key={task.id}
            >
              <button
                className={`mr-3 rounded-full border px-2 py-1 text-xs font-semibold transition ${
                  task.completed
                    ? "border-emerald-300 bg-emerald-400/20 text-emerald-300"
                    : "border-slate-500 text-slate-300 hover:border-cyan-300 hover:text-cyan-200"
                }`}
                onClick={() => toggleTaskCompleted(task.id)}
                type="button"
              >
                {task.completed ? "Completed" : "Pending"}
              </button>

              <span
                className={`flex-1 break-words text-left ${
                  task.completed
                    ? "text-slate-400 line-through"
                    : "text-slate-100"
                }`}
              >
                {task.title}
              </span>

              <button
                className="ml-3 rounded-lg border border-rose-400/60 px-3 py-1 text-sm text-rose-200 transition hover:bg-rose-500/20"
                onClick={() => removeTask(task.id)}
                type="button"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

// Component:
// PomodoroTimer controls timer mode, time updates and transitions.
function PomodoroTimer() {
  // React State:
  // These states represent timer data and UI state.
  const [mode, setMode] = useState<TimerMode>("focus");
  const [timeLeftInSeconds, setTimeLeftInSeconds] = useState(
    MODE_DURATIONS.focus,
  );
  const [isRunning, setIsRunning] = useState(false);
  const [focusSessionsDone, setFocusSessionsDone] = useState(0);

  // useCallback:
  // This function is reused by buttons to switch mode and reset timer values.
  const switchMode = useCallback((nextMode: TimerMode) => {
    setMode(nextMode);
    setTimeLeftInSeconds(MODE_DURATIONS[nextMode]);
    setIsRunning(false);
  }, []);

  // useCallback:
  // Runs the transition rules when countdown reaches zero.
  const handleTimerFinished = useCallback(() => {
    setIsRunning(false);

    if (mode === "focus") {
      setFocusSessionsDone((previousSessions) => {
        const updatedSessions = previousSessions + 1;
        const breakMode: TimerMode =
          updatedSessions % 4 === 0 ? "longBreak" : "shortBreak";

        setMode(breakMode);
        setTimeLeftInSeconds(MODE_DURATIONS[breakMode]);
        return updatedSessions;
      });

      return;
    }

    setMode("focus");
    setTimeLeftInSeconds(MODE_DURATIONS.focus);
  }, [mode]);

  // useEffect + setInterval:
  // Starts a 1-second interval when running, decreases time, and clears interval
  // on stop/unmount to avoid duplicated timers and memory leaks.
  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setTimeLeftInSeconds((previousTime) => {
        if (previousTime <= 1) {
          window.clearInterval(intervalId);
          handleTimerFinished();
          return 0;
        }

        return previousTime - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [handleTimerFinished, isRunning]);

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(timeLeftInSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (timeLeftInSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }, [timeLeftInSeconds]);

  const modeButtons: TimerMode[] = ["focus", "shortBreak", "longBreak"];

  return (
    <section className="w-full max-w-2xl rounded-3xl border border-slate-700/70 bg-slate-900/50 p-6 text-center shadow-2xl backdrop-blur-sm sm:p-8">
      <div className="mb-8 flex justify-center gap-2 rounded-full bg-slate-800/70 p-1">
        {modeButtons.map((modeButton) => (
          <TabButton
            isActive={mode === modeButton}
            key={modeButton}
            label={MODE_LABELS[modeButton]}
            onClick={() => switchMode(modeButton)}
          />
        ))}
      </div>

      <p className="mb-4 text-sm uppercase tracking-[0.3em] text-cyan-200/80">
        {MODE_LABELS[mode]}
      </p>
      <h1
        className={`mb-8 text-7xl font-bold leading-none sm:text-8xl ${MODE_TIMER_COLORS[mode]}`}
      >
        {formattedTime}
      </h1>

      <div className="mb-4 flex justify-center gap-3">
        <button
          className="rounded-full bg-slate-100 px-8 py-3 text-lg font-semibold text-slate-900 transition hover:bg-cyan-200"
          onClick={() => setIsRunning((previous) => !previous)}
          type="button"
        >
          {isRunning ? "Pause" : "Start"}
        </button>

        <button
          className="rounded-full border border-slate-500 px-8 py-3 text-lg font-semibold text-slate-200 transition hover:border-cyan-300 hover:text-cyan-200"
          onClick={() => {
            setIsRunning(false);
            setTimeLeftInSeconds(MODE_DURATIONS[mode]);
          }}
          type="button"
        >
          Reset
        </button>
      </div>

      <p className="text-slate-400">Focus sessions completed: {focusSessionsDone}</p>
    </section>
  );
}

export default function App() {
  // React State:
  // Controls which main screen is visible in the app.
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>("pomodoro");

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-slate-950 via-[#0a1440] to-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-8">
        <header className="w-full max-w-2xl rounded-2xl border border-slate-700/70 bg-slate-900/50 p-2 shadow-xl backdrop-blur-sm">
          <div className="flex items-center justify-center gap-2">
            <TabButton
              isActive={activeScreen === "pomodoro"}
              label="Pomodoro"
              onClick={() => setActiveScreen("pomodoro")}
            />
            <TabButton
              isActive={activeScreen === "tasks"}
              label="Task List"
              onClick={() => setActiveScreen("tasks")}
            />
          </div>
        </header>

        {activeScreen === "pomodoro" ? <PomodoroTimer /> : <Tasks />}
      </div>
    </main>
  );
}
