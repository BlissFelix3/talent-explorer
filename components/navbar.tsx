"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ModeToggle } from "@/components/mode-toggle"
import { useAuthStore } from "@/lib/stores/auth-store"
import { Search, Bookmark, MessageCircle, LogOut, Settings, User } from "lucide-react"

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const isPublicPage = pathname === "/login" || pathname === "/signup"
  const isLandingPage = pathname === "/"

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href={isAuthenticated ? "/search" : "/"} className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-blue-600">
            <span className="text-sm font-bold text-white">TS</span>
          </div>
          <span className="font-bold">TalentScope</span>
        </Link>

        {isLandingPage && !isAuthenticated && (
          <nav className="ml-8 hidden md:flex items-center space-x-6">
            <Link
              href="/#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="/#how-it-works"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/#testimonials"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Testimonials
            </Link>
          </nav>
        )}

        {isAuthenticated && (
          <nav className="ml-8 flex items-center space-x-6">
            <Link
              href="/search"
              className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/search" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Search</span>
            </Link>
            <Link
              href="/shortlist"
              className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/shortlist" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Bookmark className="h-4 w-4" />
              <span className="hidden sm:inline">Shortlist</span>
            </Link>
            <Link
              href="/messages"
              className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary ${
                pathname.startsWith("/messages") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Messages</span>
            </Link>
          </nav>
        )}

        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar || "/placeholder.svg?height=32&width=32"} alt={user?.name} />
                    <AvatarFallback>
                      <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                        {user?.name?.charAt(0)}
                      </div>
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user?.name}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings/profile" className="w-full cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="w-full cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Account Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            !isPublicPage && (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button
                  asChild
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Link href="/signup">Get started</Link>
                </Button>
              </div>
            )
          )}
        </div>
      </div>
    </header>
  )
}
