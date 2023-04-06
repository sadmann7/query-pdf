export function SiteFooter() {
  return (
    <footer className="w-full bg-white dark:bg-zinc-900">
      <div className="container grid place-items-center space-y-2 border-t border-t-slate-500 py-3">
        <div className="text-center text-sm text-slate-800 dark:text-slate-400 sm:text-base">
          Powered by{" "}
          <a
            aria-label="Navigate to OpenAI's website"
            href="https://openai.com/"
            target="_blank"
            rel="noreferrer"
            className="font-semibold transition-colors hover:text-slate-950 dark:hover:text-slate-200"
          >
            OpenAI
          </a>
          {", and "}
          <a
            aria-label="Navigate to Vercel's website"
            href="https://vercel.com"
            target="_blank"
            rel="noreferrer"
            className="font-semibold transition-colors hover:text-slate-950 dark:hover:text-slate-200"
          >
            Vercel
          </a>
        </div>
        <div className="text-center text-sm text-slate-800 dark:text-slate-400 sm:text-base">
          Based on the discography of{" "}
          <a
            aria-label="Naviage to Artcell's Facebook page"
            href="https://www.facebook.com/artcellofficial/"
            target="_blank"
            rel="noreferrer"
            className="font-semibold transition-colors hover:text-slate-950 dark:hover:text-slate-200"
          >
            Artcell
          </a>
          . Speical thanks to{" "}
          <a
            aria-label="Navigate to Mckay Wrigley's Twitter"
            href="https://twitter.com/mckaywrigley"
            target="_blank"
            rel="noreferrer"
            className="font-semibold transition-colors hover:text-slate-950 dark:hover:text-slate-200"
          >
            Mckay Wrigley
          </a>
          {", and "}
          <a
            aria-label="Navigate to Mayo's Twitter"
            href="https://twitter.com/mayowaoshin"
            target="_blank"
            rel="noreferrer"
            className="font-semibold transition-colors hover:text-slate-950 dark:hover:text-slate-200"
          >
            Mayo
          </a>{" "}
          for their templates.
        </div>
      </div>
    </footer>
  )
}
