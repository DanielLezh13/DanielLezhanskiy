import { currentViews } from "@/lib/current-views";

export function CurrentViews() {
  return (
    <article className="content-view-enter mx-auto w-full max-w-[1040px] px-5 py-10 sm:px-8 sm:py-14 lg:px-10 lg:py-20">
      <header className="rounded-lg border border-amber-200/20 bg-amber-100/[0.035] px-6 py-10 text-center sm:px-10 sm:py-12">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber-200/65">
          A concise belief map
        </p>
        <h2 className="mt-4 text-4xl font-semibold text-stone-50 sm:text-5xl">
          Current Views
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-stone-400 sm:text-lg">
          The clearest short version of where I currently stand. These are working
          positions, not replacements for the full arguments or permanent declarations
          of certainty.
        </p>
      </header>

      <nav aria-label="Current view topics" className="mt-10 border-y border-white/10 py-5">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
          {currentViews.map((view) => (
            <a
              className="text-sm text-stone-400 transition hover:text-amber-100"
              href={`#${view.id}`}
              key={view.id}
            >
              {view.topic}
            </a>
          ))}
        </div>
      </nav>

      <div className="mt-4">
        {currentViews.map((view, index) => (
          <section
            className="scroll-mt-8 border-b border-white/10 py-12 sm:py-14"
            id={view.id}
            key={view.id}
          >
            <div className="grid gap-6 lg:grid-cols-[180px_minmax(0,1fr)] lg:gap-10">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-amber-200/65">
                  {String(index + 1).padStart(2, "0")} / {view.topic}
                </p>
                <span className="mt-4 inline-flex rounded-full border border-white/10 px-3 py-1 text-xs text-stone-400">
                  {view.confidence}
                </span>
              </div>

              <div>
                <h3 className="max-w-3xl text-2xl font-semibold leading-9 text-stone-50 sm:text-3xl sm:leading-10">
                  {view.title}
                </h3>
                <p className="mt-5 text-base leading-8 text-stone-300 sm:text-[17px]">
                  {view.position}
                </p>

                <div className="mt-7 grid gap-6 border-l border-amber-200/25 pl-5 sm:grid-cols-2 sm:gap-8">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-500">
                      Why I lean this way
                    </p>
                    <p className="mt-3 text-sm leading-7 text-stone-400">{view.reasoning}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-500">
                      Still unresolved
                    </p>
                    <p className="mt-3 text-sm leading-7 text-stone-400">{view.unresolved}</p>
                  </div>
                </div>

                <p className="mt-7 text-xs text-stone-500">
                  Full analysis: <span className="text-stone-400">{view.relatedSection}</span>
                </p>
              </div>
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
