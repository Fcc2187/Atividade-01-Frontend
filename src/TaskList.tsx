import { FormEvent, useCallback, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { PomodoroTimer } from "./PomodoroTimer";
import { ActiveScreen, TopBar } from "./TopBar";

type Task = {
  completed: boolean;
  id: string;
  title: string;
};

export default function App() {
  // Opens on Task List by default.
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>("tasks");
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

  const removeTask = useCallback((taskToRemove: Task) => {
    void Swal.fire({
      icon: "warning",
      title: "Remove task?",
      text: `Are you sure you want to remove "${taskToRemove.title}"?`,
      showCancelButton: true,
      confirmButtonText: "Yes, remove",
      cancelButtonText: "Cancel",
      background: "#0f1b3d",
      color: "#f7f8ff",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#334155",
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      setTasks((previousTasks) =>
        previousTasks.filter((task) => task.id !== taskToRemove.id),
      );

      void Swal.fire({
        icon: "success",
        title: "Task removed",
        text: "The task was removed successfully.",
        timer: 1300,
        showConfirmButton: false,
        background: "#0f1b3d",
        color: "#f7f8ff",
      });
    });
  }, []);

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-slate-950 via-[#0a1440] to-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-8">
        <TopBar activeScreen={activeScreen} onChangeScreen={setActiveScreen} />

        {activeScreen === "pomodoro" ? (
          <PomodoroTimer />
        ) : (
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
                      onClick={() => removeTask(task)}
                      type="button"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
