"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Settings, User } from "lucide-react"

export function SettingsSidebar() {
  const pathname = usePathname()

  const links = [
    {
      title: "Account",
      links: [
        {
          title: "General",
          href: "/settings",
          icon: Settings,
          active: pathname === "/settings",
        },
        {
          title: "Profile",
          href: "/settings/profile",
          icon: User,
          active: pathname === "/settings/profile",
        },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      {links.map((group) => (
        <div key={group.title} className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground px-4">{group.title}</h3>
          <div className="space-y-1">
            {group.links.map((link) => (
              <Button
                key={link.href}
                variant={link.active ? "secondary" : "ghost"}
                className={`w-full justify-start ${link.active ? "bg-secondary" : ""}`}
                asChild
              >
                <Link href={link.href}>
                  <link.icon className="mr-2 h-4 w-4" />
                  {link.title}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
