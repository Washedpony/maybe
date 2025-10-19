"use client"

import { useState } from "react"
import {
  Briefcase,
  FileText,
  HeadphonesIcon,
  User,
  Menu,
  X,
  LayoutDashboard,
  Newspaper,
  ClipboardCheck,
  Building2,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Newspaper, label: "Community", href: "/community" },
  { icon: Zap, label: "Micro-Gigs", href: "/micro-gigs" },
  { icon: Briefcase, label: "Jobs", href: "/jobs" },
  { icon: FileText, label: "Grants", href: "/grants" },
  { icon: HeadphonesIcon, label: "Support", href: "/support" },
  { icon: Building2, label: "Company", href: "/company" },
  { icon: User, label: "Profile", href: "/profile" },
]

const adminNavItems = [
  { icon: LayoutDashboard, label: "Admin Dashboard", href: "/admin" },
  { icon: ClipboardCheck, label: "Review Submissions", href: "/admin/reviews" },
  { icon: Newspaper, label: "Community", href: "/community" },
  { icon: Zap, label: "Micro-Gigs", href: "/micro-gigs" },
  { icon: Briefcase, label: "Jobs", href: "/jobs" },
  { icon: FileText, label: "Grants", href: "/grants" },
  { icon: HeadphonesIcon, label: "Support", href: "/support" },
  { icon: Building2, label: "Company", href: "/company" },
  { icon: User, label: "Profile", href: "/profile" },
]

export function Sidebar({ isAdmin = false }: { isAdmin?: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const items = isAdmin ? adminNavItems : navItems

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-200 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-sidebar-border flex flex-col items-center">
            <div className="relative w-40 h-24 flex items-center justify-center mb-2">
              <Image src="/images/jobync-logo.png" alt="Jobsync Logo" fill className="object-contain" priority />
            </div>
            <p className="text-sm text-muted-foreground">{isAdmin ? "Admin Panel" : "Citizen Services"}</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {items.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-4 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors group"
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-lg font-medium">{item.label}</span>
              </a>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border">
            <p className="text-sm text-muted-foreground text-center">Government of Jamaica</p>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsOpen(false)} />}
    </>
  )
}
