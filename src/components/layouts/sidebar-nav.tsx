"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { NavItem } from "@/types/nav"
import { cn, truncate } from "@/lib/utils"

export interface SidebarNavProps {
  items: NavItem[]
}

export function SidebarNav({ items }: SidebarNavProps) {
  const pathname = usePathname()

  return items.length ? (
    <div className="w-full">
      {items.map((item, index) => (
        <div key={index} className={cn("pb-1")}>
          {item && (
            <div className="grid grid-flow-row auto-rows-max text-sm">
              {item.href ? (
                <Link
                  href={item.href}
                  className={cn(
                    "group flex w-full items-center gap-2.5 rounded-md px-4 py-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-800",
                    {
                      "bg-slate-100 dark:bg-zinc-800": pathname === item.href,
                    }
                  )}
                  target={item.external ? "_blank" : ""}
                  rel={item.external ? "noreferrer" : ""}
                >
                  {item.icon && (
                    <item.icon
                      className="h-5 w-5 text-slate-600 dark:text-slate-200"
                      aria-hidden="true"
                    />
                  )}
                  {item.title ? truncate(item.title, 16) : ""}
                  {item.label && (
                    <span className="ml-2 rounded-md bg-teal-100 px-1.5 py-0.5 text-xs no-underline group-hover:no-underline dark:text-slate-900">
                      {item.label}
                    </span>
                  )}
                </Link>
              ) : (
                <span className="flex w-full cursor-pointer items-center gap-2.5 rounded-md px-4 py-2.5 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                  {item.icon && (
                    <item.icon
                      className="h-5 w-5 text-slate-600 dark:text-slate-200"
                      aria-hidden="true"
                    />
                  )}
                  {item.title ? truncate(item.title, 16) : ""}
                </span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  ) : null
}
