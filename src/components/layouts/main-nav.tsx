import Link from "next/link"
import type { GlobalConfig } from "@/types"

import { siteConfig } from "@/config/site"
import { cn, truncate } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface MainNavProps {
  config: GlobalConfig
}

export function MainNav({ config }: MainNavProps) {
  return (
    <div className="flex gap-6">
      <Link href="/" className="hidden items-center space-x-2 md:flex">
        <Icons.logo className="h-6 w-6" />
        <span className="hidden font-bold sm:inline-block">
          {siteConfig.name}
        </span>
      </Link>
      {config.mainNav?.length ? (
        <nav className="hidden gap-6 md:flex">
          {config.mainNav?.map(
            (item, index) =>
              item.href && (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center text-lg font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-100 sm:text-sm",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                >
                  {item.title}
                </Link>
              )
          )}
        </nav>
      ) : null}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="-ml-4 text-base hover:bg-transparent focus:ring-0 md:hidden"
          >
            <Icons.logo className="mr-2 h-4 w-4" />
            <span className="font-bold">Menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          sideOffset={24}
          className="max-h-[calc(100vh-10rem)] w-60 overflow-y-auto"
        >
          <DropdownMenuLabel>
            <Link href="/" className="flex items-center">
              <Icons.logo className="mr-2 h-4 w-4" /> {siteConfig.name}
            </Link>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {(config.sidebarNav ?? config.mainNav)?.map((item, index) =>
            item.href ? (
              <DropdownMenuItem
                key={index}
                asChild
                className="flex items-center gap-2.5"
              >
                <Link href={item.href}>
                  {item.icon && (
                    <item.icon className="h-4 w-4" aria-hidden="true" />
                  )}
                  <span className="line-clamp-1">
                    {item.title ? truncate(item.title, 24) : ""}
                  </span>
                </Link>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                key={index}
                className="flex items-center gap-2.5"
              >
                {item.icon && (
                  <item.icon className="h-4 w-4" aria-hidden="true" />
                )}
                {item.title ? truncate(item.title, 24) : ""}
              </DropdownMenuItem>
            )
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
