import Link from "next/link"

import type { GlobalConfig } from "@/types/"
import { siteConfig } from "@/config/site"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/layouts/main-nav"
import { ThemeToggle } from "@/components/layouts/theme-toggle"
import { buttonVariants } from "@/components/ui/button"

interface SiteHeaderProps {
  config: GlobalConfig
}

export function SiteHeader({ config }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-zinc-900">
      <div className="container flex h-16 items-center space-x-4 border-b border-b-slate-400 dark:border-b-slate-600 sm:justify-between sm:space-x-0">
        <MainNav config={config} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={buttonVariants({
                  size: "sm",
                  variant: "ghost",
                  className: "text-slate-700 dark:text-slate-400",
                })}
              >
                <Icons.gitHub className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
            <Link
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={buttonVariants({
                  size: "sm",
                  variant: "ghost",
                  className: "text-slate-700 dark:text-slate-400",
                })}
              >
                <Icons.twitter className="h-5 w-5 fill-current" />
                <span className="sr-only">Twitter</span>
              </div>
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}
