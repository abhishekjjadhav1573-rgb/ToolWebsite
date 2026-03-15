import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export function Privacy() {
  return (
    <div className="max-w-3xl mx-auto py-8 prose dark:prose-invert">
      <h1 className="font-display font-bold">Privacy Policy</h1>
      <p>Last updated: Today</p>
      <p>At Smart Fin Metrics, we take your privacy seriously. Since our tools operate entirely on your device (client-side), we do not collect, store, or transmit your calculation data or generated assets to any external servers.</p>
      <h2>Data Collection</h2>
      <p>We do not collect personal usage data from our calculators. Any inputs you provide remain within your browser session and disappear when you leave or refresh.</p>
      <h2>Third-Party Services</h2>
      <p>We may use basic analytics to understand page views and standard web metrics. These are anonymous and contain no personal identifiable information.</p>
    </div>
  );
}

export function Terms() {
  return (
    <div className="max-w-3xl mx-auto py-8 prose dark:prose-invert">
      <h1 className="font-display font-bold">Terms of Service</h1>
      <p>Welcome to Smart Fin Metrics. By accessing our website, you agree to these terms.</p>
      <h2>Usage</h2>
      <p>These tools are provided "as is" without warranty of any kind. They are designed for educational and informational purposes.</p>
      <h2>Accuracy</h2>
      <p>While we strive for precision in our calculators (EMI, SIP, Health, etc.), you should not rely exclusively on them for critical financial or medical decisions.</p>
    </div>
  );
}

export function Disclaimer() {
  return (
    <div className="max-w-3xl mx-auto py-8 prose dark:prose-invert">
      <h1 className="font-display font-bold">Disclaimer</h1>
      <p>The calculators and utilities available on Smart Fin Metrics are for general informational purposes only.</p>
      <p><strong>Financial Tools:</strong> Do not constitute financial advice. Please consult a certified financial advisor before making investments or taking out loans.</p>
      <p><strong>Health Tools:</strong> Do not constitute medical advice. Consult a healthcare professional regarding diet, weight management, and physical health.</p>
    </div>
  );
}

export function About() {
  return (
    <div className="max-w-3xl mx-auto py-8 prose dark:prose-invert">
      <h1 className="font-display font-bold">About Us</h1>
      <p>Smart Fin Metrics was created to consolidate the most commonly used daily calculators and generators into one fast, modern, and beautiful interface.</p>
      <p>We grew tired of ad-cluttered, slow, and outdated calculators across the web. Our mission is to provide premium-feeling utility tools for free, running securely right inside your browser.</p>
    </div>
  );
}

export function Contact() {
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Message Sent!", description: "Thanks for reaching out. We will get back to you soon." });
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold mb-4">Contact Us</h1>
        <p className="text-muted-foreground text-lg">Have a suggestion for a new tool? Found a bug? Let us know.</p>
      </div>
      <Card className="border shadow-lg shadow-black/5">
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input required className="bg-muted/50" />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input className="bg-muted/50" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" required className="bg-muted/50" />
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea required rows={5} className="bg-muted/50" />
            </div>
            <Button type="submit" className="w-full h-12 text-lg rounded-xl">Send Message</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
