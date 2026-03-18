import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Box, Github, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toolsRegistry } from "@/lib/tool-registry";
import { AdSpace } from "./AdSpace";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const categories = Array.from(new Set(toolsRegistry.map(t => t.category)));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="flex h-16 items-center px-4 md:px-6">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden mr-2"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          
          <Link href="/" className="flex items-center gap-2 mr-6 hover:opacity-90 transition-opacity">
            <div className="bg-primary p-1.5 rounded-lg">
              <Box className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg hidden sm:inline-block">Smart Fin Metrics</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium ml-6">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">Home</Link>
            <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">About</Link>
            <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
          </nav>

          <div className="ml-auto flex items-center space-x-4">
            <nav className="hidden sm:flex items-center gap-4 text-sm font-medium text-muted-foreground lg:hidden">
              <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
              <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
            </nav>
            <Button size="sm" className="rounded-full shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all hover:-translate-y-0.5">
              Explore Pro
            </Button>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="flex-1 flex flex-col md:flex-row max-w-[1600px] w-full mx-auto">
        
        {/* Sidebar Overlay (Mobile) */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={cn(
          "fixed top-16 bottom-0 z-40 w-72 border-r bg-card md:sticky md:block transition-transform duration-300 ease-in-out",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}>
          <ScrollArea className="h-full">
            <div className="py-6 px-4 space-y-8">
              {categories.map(category => (
                <div key={category} className="space-y-3">
                  <h4 className="font-display text-sm font-bold text-muted-foreground tracking-wider uppercase px-2">
                    {category}
                  </h4>
                  <div className="space-y-1">
                    {toolsRegistry.filter(t => t.category === category).map(tool => {
                      const isActive = location === `/tool/${tool.id}`;
                      const Icon = tool.icon;
                      return (
                        <Link 
                          key={tool.id} 
                          href={`/tool/${tool.id}`}
                          onClick={() => setSidebarOpen(false)}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                            isActive 
                              ? "bg-primary/10 text-primary" 
                              : "text-foreground hover:bg-muted"
                          )}
                        >
                          <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                          {tool.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
              
              <div className="pt-4 border-t px-2">
                <AdSpace type="rectangle" className="w-[240px] h-[200px]" />
              </div>
            </div>
          </ScrollArea>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 flex flex-col">
          <div className="w-full bg-muted/20 border-b">
            <div className="container py-4 px-4 md:px-6">
              <AdSpace type="leaderboard" />
            </div>
          </div>
          
          <div className="flex-1 p-4 md:p-8">
            {children}
          </div>

          <div className="container px-4 md:px-6 pb-8 pt-4">
            <AdSpace type="banner" />
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t bg-card py-12">
        <div className="container px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Box className="h-6 w-6 text-primary" />
            <span className="font-display font-bold text-lg">Smart Fin Metrics</span>
          </div>
          
          <div className="flex gap-6 text-sm font-medium text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link href="/disclaimer" className="hover:text-foreground transition-colors">Disclaimer</Link>
          </div>
          
          <div className="flex gap-4">
            <Button variant="ghost" size="icon" className="rounded-full"><Twitter className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className="rounded-full"><Github className="h-4 w-4" /></Button>
          </div>
        </div>
        <div className="container px-4 md:px-6 mt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Smart Fin Metrics. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
