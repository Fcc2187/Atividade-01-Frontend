import { useCallback, useEffect, useMemo, useState } from "react";

type TimerMode = "focus" | "shortBreak" | "longBreak";

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

function TabButton({ isActive, label, onClick }: TabButtonProps) {
  // Component + Props:
  // This reusable button receives visual state and click behavior from parent.
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

export function PomodoroTimer() {
  // Component:
  // PomodoroTimer handles the countdown flow and mode transitions.

  // React State:
  // Stores the timer mode, remaining time and running session data.
  const [mode, setMode] = useState<TimerMode>("focus");
  const [timeLeftInSeconds, setTimeLeftInSeconds] = useState(
    MODE_DURATIONS.focus,
  );
  const [isRunning, setIsRunning] = useState(false);
  const [focusSessionsDone, setFocusSessionsDone] = useState(0);

  // useCallback (React Hook):
  // Memoizes mode switching logic to keep function identity stable.
  const switchMode = useCallback((nextMode: TimerMode) => {
    setMode(nextMode);
    setTimeLeftInSeconds(MODE_DURATIONS[nextMode]);
    setIsRunning(false);
  }, []);

  // useCallback (React Hook):
  // Memoizes the finish handler that applies Pomodoro transition rules.
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

  // useEffect (React Hook) + Intervals (setInterval):
  // Starts a 1-second ticking interval while running and cleans it up to avoid
  // duplicated timers or memory leaks.
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
