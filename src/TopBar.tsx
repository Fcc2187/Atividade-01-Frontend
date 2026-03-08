export type ActiveScreen = "pomodoro" | "tasks";

type TopBarProps = {
  activeScreen: ActiveScreen;
  onChangeScreen: (screen: ActiveScreen) => void;
};

type TabButtonProps = {
  isActive: boolean;
  label: string;
  onClick: () => void;
};

function TabButton({ isActive, label, onClick }: TabButtonProps) {
  // Component + Props:
  // Reusable tab button that receives active state, label and click action.
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

export function TopBar({ activeScreen, onChangeScreen }: TopBarProps) {
  // Component + Props:
  // TopBar receives current screen and callback to switch between screens.
  return (
    <header className="w-full max-w-2xl rounded-2xl border border-slate-700/70 bg-slate-900/50 p-2 shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-center gap-2">
        <TabButton
          isActive={activeScreen === "tasks"}
          label="Task List"
          onClick={() => onChangeScreen("tasks")}
        />
        <TabButton
          isActive={activeScreen === "pomodoro"}
          label="Pomodoro"
          onClick={() => onChangeScreen("pomodoro")}
        />
      </div>
    </header>
  );
}
