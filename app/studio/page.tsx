"use client";

import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { ArrowLeft, ArrowRight, LoaderCircle, LogOut } from "lucide-react";
import {
  getSupabaseBrowserClient,
  hasSupabaseConfig,
} from "@/lib/supabase/client";

type AccessState = "checking" | "editor" | "restricted" | "signed-out";

export default function StudioPage() {
  const client = getSupabaseBrowserClient();
  const configured = hasSupabaseConfig();
  const [access, setAccess] = useState<AccessState>(
    configured ? "checking" : "signed-out",
  );
  const [user, setUser] = useState<User | null>(null);

  const verifyAccess = useCallback(
    async (nextUser?: User | null) => {
      if (!client) return;

      setAccess("checking");
      const resolvedUser =
        nextUser === undefined
          ? (await client.auth.getUser()).data.user
          : nextUser;
      setUser(resolvedUser);
      if (!resolvedUser) {
        setAccess("signed-out");
        return;
      }

      const { data } = await client
        .from("site_editors")
        .select("user_id")
        .eq("user_id", resolvedUser.id)
        .maybeSingle();
      setAccess(data ? "editor" : "restricted");
    },
    [client],
  );

  useEffect(() => {
    if (!client) return;
    void verifyAccess();
    const { data } = client.auth.onAuthStateChange((_event, session) => {
      window.setTimeout(() => void verifyAccess(session?.user ?? null), 0);
    });
    return () => data.subscription.unsubscribe();
  }, [client, verifyAccess]);

  if (!configured || !client) return <StudioSetup />;
  if (access === "checking") {
    return (
      <StudioFrame>
        <div className="flex items-center gap-3 text-sm text-stone-400">
          <LoaderCircle className="h-4 w-4 animate-spin" /> Checking publishing
          access...
        </div>
      </StudioFrame>
    );
  }
  if (access === "signed-out")
    return <StudioLogin onAuthenticated={verifyAccess} />;

  if (access === "restricted") {
    return (
      <StudioFrame>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber-200/65">
          Access restricted
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-stone-50">
          This account cannot publish.
        </h1>
        <p className="mt-4 max-w-xl leading-7 text-stone-400">
          The account is signed in, but it is not listed in the site&apos;s
          editor permissions.
        </p>
        <button
          className="mt-7 inline-flex h-10 items-center gap-2 rounded-md border border-white/10 px-4 text-sm text-stone-300 hover:border-white/20 hover:text-white"
          onClick={() => void client.auth.signOut()}
          type="button"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </StudioFrame>
    );
  }

  return (
    <StudioFrame>
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber-200/65">
        Publishing access active
      </p>
      <h1 className="mt-4 text-3xl font-semibold text-stone-50">
        Continue to Feed.
      </h1>
      <p className="mt-4 max-w-xl leading-7 text-stone-400">
        You are signed in as {user?.email}. The composer and post controls now
        appear inside the same Feed that visitors read.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <a
          className="inline-flex h-11 items-center gap-2 rounded-md bg-amber-100 px-5 text-sm font-medium text-stone-950 hover:bg-amber-50"
          href="/?view=notes"
        >
          Open Feed <ArrowRight className="h-4 w-4" />
        </a>
        <button
          className="inline-flex h-11 items-center gap-2 rounded-md border border-white/10 px-4 text-sm text-stone-400 hover:border-white/20 hover:text-white"
          onClick={() => void client.auth.signOut()}
          type="button"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    </StudioFrame>
  );
}

function StudioLogin({
  onAuthenticated,
}: {
  onAuthenticated: (user: User | null) => Promise<void>;
}) {
  const client = getSupabaseBrowserClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!client || isSubmitting) return;
    setIsSubmitting(true);
    setError("");

    const result = await client.auth.signInWithPassword({ email, password });
    if (result.error || !result.data.user) {
      setError(result.error?.message ?? "Sign-in failed.");
      setIsSubmitting(false);
      return;
    }

    const { data: editor } = await client
      .from("site_editors")
      .select("user_id")
      .eq("user_id", result.data.user.id)
      .maybeSingle();
    if (!editor) {
      await onAuthenticated(result.data.user);
      setIsSubmitting(false);
      return;
    }

    window.location.assign("/?view=notes");
  }

  return (
    <StudioFrame>
      <a
        className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-200"
        href="/"
      >
        <ArrowLeft className="h-4 w-4" /> Return to site
      </a>
      <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-amber-200/65">
        Private access
      </p>
      <h1 className="mt-4 text-3xl font-semibold text-stone-50">
        Publish to Feed
      </h1>
      <p className="mt-4 max-w-lg leading-7 text-stone-400">
        Sign in with the owner account. Publishing controls will appear in the
        public Feed without creating a second version of the page.
      </p>
      <form className="mt-8 max-w-sm space-y-4" onSubmit={login}>
        <input
          autoComplete="email"
          className={inputClassName}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          required
          type="email"
          value={email}
        />
        <input
          autoComplete="current-password"
          className={inputClassName}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          required
          type="password"
          value={password}
        />
        <button
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-amber-100 text-sm font-medium text-stone-950 hover:bg-amber-50 disabled:cursor-wait disabled:opacity-60"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : null}
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
        {error ? (
          <p aria-live="polite" className="text-sm text-red-300">
            {error}
          </p>
        ) : null}
      </form>
    </StudioFrame>
  );
}

function StudioSetup() {
  return (
    <StudioFrame>
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber-200/65">
        Setup required
      </p>
      <h1 className="mt-4 text-3xl font-semibold text-stone-50">
        Connect Feed publishing.
      </h1>
      <p className="mt-4 max-w-xl leading-7 text-stone-400">
        The public Feed works without credentials. To publish persistently, add
        the Supabase public values to{" "}
        <code className="text-stone-300">.env.local</code>, run{" "}
        <code className="text-stone-300">supabase/schema.sql</code>, then add
        your authenticated account to{" "}
        <code className="text-stone-300">site_editors</code>.
      </p>
      <div className="mt-7 max-w-xl rounded-lg border border-white/10 bg-black/25 p-5 font-mono text-xs leading-7 text-stone-300">
        <p>NEXT_PUBLIC_SUPABASE_URL=</p>
        <p>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=</p>
      </div>
      <a
        className="mt-8 inline-flex items-center gap-2 text-sm text-amber-100 hover:text-amber-50"
        href="/"
      >
        <ArrowLeft className="h-4 w-4" /> Return to site
      </a>
    </StudioFrame>
  );
}

function StudioFrame({ children }: { children: ReactNode }) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#11110f] px-5 text-stone-100">
      <section className="w-full max-w-2xl rounded-lg border border-amber-200/20 bg-amber-100/[0.025] p-7 shadow-[0_30px_100px_rgba(0,0,0,0.28)] sm:p-10">
        {children}
      </section>
    </main>
  );
}

const inputClassName =
  "w-full rounded-md border border-white/10 bg-black/25 px-3 py-2.5 text-sm text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-amber-200/45";
