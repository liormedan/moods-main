"use client"

import { Settings, LogOut, Mail, Calendar } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface UserProfileMenuProps {
  email: string
  createdAt?: string
  onSignOut: () => void
  onSettingsClick?: () => void
  compact?: boolean
}

export function UserProfileMenu({ email, createdAt, onSignOut, onSettingsClick, compact }: UserProfileMenuProps) {
  const username = email.split("@")[0]
  const initials = username.slice(0, 2).toUpperCase()

  return (
    <DropdownMenu dir="rtl">
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border-2 border-primary/20">
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="start" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-2 p-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium leading-none">{username}</p>
                <p className="text-xs leading-none text-muted-foreground flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {email}
                </p>
              </div>
            </div>
            {createdAt && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground pt-2 border-t">
                <Calendar className="h-3 w-3" />
                <span>הצטרף ב-{new Date(createdAt).toLocaleDateString("he-IL")}</span>
              </div>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onSettingsClick} className="cursor-pointer">
          <Settings className="ml-2 h-4 w-4" />
          <span>הגדרות</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onSignOut}
          className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
        >
          <LogOut className="ml-2 h-4 w-4" />
          <span>התנתק</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
