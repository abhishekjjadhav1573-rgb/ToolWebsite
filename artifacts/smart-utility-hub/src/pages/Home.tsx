import React from "react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toolsRegistry } from "@/lib/tool-registry";

export function Home() {
  const categories = Array.from(new Set(toolsRegistry.map(t => t.category)));

  return (
    <div className="space-y-16 pb-12 animate-in fade-in duration-700">
      
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-card border shadow-xl shadow-black/5">
        <img 
          src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
          alt="Abstract elegant background" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 dark:opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/40" />
        
        <div className="relative z-10 px-8 py-20 md:py-32 max-w-3xl">
          <div className="inline-flex items-center rounded-full border bg-background/50 backdrop-blur-md px-3 py-1 text-sm font-medium mb-6">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
            12+ Smart Tools Inside
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tight text-foreground mb-6 leading-tight">
            Free Smart <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">Calculators</span> & Utility Tools
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
            Everything you need in one place. Finance, Health, Math, and Utility tools designed to be beautiful, fast, and completely client-side.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" asChild className="rounded-full h-14 px-8 text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-1 transition-all">
              <Link href="/tool/emi">
                Explore Tools <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Grid Sections */}
      <div className="space-y-16">
        {categories.map(category => (
          <section key={category} className="space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <h2 className="text-2xl font-display font-bold text-foreground">{category} Tools</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {toolsRegistry.filter(t => t.category === category).map(tool => {
                const Icon = tool.icon;
                return (
                  <Link key={tool.id} href={`/tool/${tool.id}`} className="group block">
                    <div className="h-full bg-card rounded-2xl p-6 border shadow-sm hover:shadow-xl hover:border-primary/50 transition-all duration-300 hover:-translate-y-1">
                      <div className="bg-primary/5 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2">{tool.name}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{tool.description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>

    </div>
  );
}
