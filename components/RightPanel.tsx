type RightPanelProps = {
  ideas: string[];
};

export function RightPanel({ ideas }: RightPanelProps) {
  return (
    <aside className="border-t border-white/10 px-6 pb-10 pt-8 lg:sticky lg:top-0 lg:h-screen lg:border-l lg:border-t-0 lg:px-6 lg:py-8">
      <div className="lg:sticky lg:top-8">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-stone-500">
          Key Ideas
        </p>
        <ul className="space-y-3">
          {ideas.map((idea) => (
            <li className="flex gap-3 text-sm leading-6 text-stone-300" key={idea}>
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-200/70" />
              <span>{idea}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
