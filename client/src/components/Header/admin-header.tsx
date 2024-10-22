import React from 'react'
import { Menu } from 'lucide-react'
import DarkModeSwitcher from './DarkModeSwitcher'
import { Button } from '../shadcn/ui/button'

interface AdminHeaderProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export default function AdminHeader({ sidebarOpen, setSidebarOpen }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-40 flex w-full bg-background border-b">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-sm md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle sidebar"
            className="lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          <DarkModeSwitcher />
        </div>
      </div>
    </header>
  )
}