import React, { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import { differenceInYears, differenceInMonths, differenceInDays, addYears, isValid, parseISO } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Copy, Download, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ResultCard = ({ title, value, highlight = false }: { title: string, value: string, highlight?: boolean }) => (
  <div className={`p-4 rounded-xl border ${highlight ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border shadow-sm'}`}>
    <p className={`text-sm font-medium mb-1 ${highlight ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>{title}</p>
    <p className="text-2xl font-display font-bold tracking-tight">{value}</p>
  </div>
);

export function AgeCalculator() {
  const [dob, setDob] = useState<string>("1990-01-01");
  const [result, setResult] = useState<{ years: number, months: number, days: number, nextBdayDays: number } | null>(null);

  const calculate = () => {
    const birthDate = parseISO(dob);
    const today = new Date();
    
    if (isValid(birthDate) && birthDate <= today) {
      const years = differenceInYears(today, birthDate);
      
      // Calculate exact months and days remaining after years
      const dateAfterYears = addYears(birthDate, years);
      const months = differenceInMonths(today, dateAfterYears);
      
      const dateAfterMonths = new Date(dateAfterYears);
      dateAfterMonths.setMonth(dateAfterMonths.getMonth() + months);
      const days = differenceInDays(today, dateAfterMonths);

      // Next birthday
      let nextBday = new Date(birthDate);
      nextBday.setFullYear(today.getFullYear());
      if (nextBday < today) {
        nextBday.setFullYear(today.getFullYear() + 1);
      }
      const nextBdayDays = differenceInDays(nextBday, today);

      setResult({ years, months, days, nextBdayDays });
    }
  };

  return (
    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
      <Card className="border-0 shadow-lg shadow-black/5 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Age Calculator</CardTitle>
          <CardDescription>Find your exact age and next birthday</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Date of Birth</Label>
            <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="bg-background" />
          </div>
          <Button onClick={calculate} className="w-full h-12 text-lg font-semibold rounded-xl">Calculate Exact Age</Button>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {result ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
            <div className="p-8 rounded-2xl border border-primary bg-primary/5 text-center shadow-inner">
              <p className="text-muted-foreground font-medium mb-2">You are</p>
              <p className="text-4xl font-display font-black text-primary">
                {result.years} <span className="text-xl font-medium text-foreground">years</span> {result.months} <span className="text-xl font-medium text-foreground">months</span> {result.days} <span className="text-xl font-medium text-foreground">days</span>
              </p>
            </div>
            <ResultCard title="Days to next birthday" value={`${result.nextBdayDays} days`} />
          </div>
        ) : (
          <div className="h-full border-2 border-dashed border-border rounded-2xl flex items-center justify-center text-muted-foreground p-8 text-center bg-muted/10">
            Select your birth date to calculate.
          </div>
        )}
      </div>
    </div>
  );
}

export function PasswordGenerator() {
  const { toast } = useToast();
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState("");

  const generate = () => {
    let charset = "";
    if (upper) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lower) charset += "abcdefghijklmnopqrstuvwxyz";
    if (numbers) charset += "0123456789";
    if (symbols) charset += "!@#$%^&*()_+~`|}{[]:;?><,./-=";
    
    if (charset === "") {
      setPassword("Please select at least one option");
      return;
    }

    let newPass = "";
    for (let i = 0; i < length; i++) {
      newPass += charset[Math.floor(Math.random() * charset.length)];
    }
    setPassword(newPass);
  };

  useEffect(() => { generate(); }, [length, upper, lower, numbers, symbols]);

  const copy = () => {
    if (password && !password.includes("Please select")) {
      navigator.clipboard.writeText(password);
      toast({ title: "Copied to clipboard!", description: "Password is ready to use." });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-0 shadow-xl shadow-black/5 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Secure Password Generator</CardTitle>
          <CardDescription>Generate strong, random passwords</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-xl group-hover:bg-primary/30 transition-colors" />
            <div className="relative flex items-center justify-between p-4 bg-background border-2 border-primary/20 rounded-xl overflow-hidden">
              <span className="font-mono text-xl tracking-wider truncate flex-1">{password}</span>
              <div className="flex gap-2 ml-4 bg-background">
                <Button variant="ghost" size="icon" onClick={generate} className="rounded-full hover:bg-muted"><RefreshCw className="h-4 w-4" /></Button>
                <Button onClick={copy} size="icon" className="rounded-full shadow-md hover:shadow-lg"><Copy className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <Label>Password Length</Label>
              <span className="font-bold text-primary">{length}</span>
            </div>
            <Slider value={[length]} onValueChange={(v) => setLength(v[0])} min={8} max={64} step={1} className="py-4" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
              <Label htmlFor="upper" className="cursor-pointer">Uppercase (A-Z)</Label>
              <Switch id="upper" checked={upper} onCheckedChange={setUpper} />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
              <Label htmlFor="lower" className="cursor-pointer">Lowercase (a-z)</Label>
              <Switch id="lower" checked={lower} onCheckedChange={setLower} />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
              <Label htmlFor="numbers" className="cursor-pointer">Numbers (0-9)</Label>
              <Switch id="numbers" checked={numbers} onCheckedChange={setNumbers} />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
              <Label htmlFor="symbols" className="cursor-pointer">Symbols (!@#$)</Label>
              <Switch id="symbols" checked={symbols} onCheckedChange={setSymbols} />
            </div>
          </div>
          
        </CardContent>
      </Card>
    </div>
  );
}

export function QrCodeGenerator() {
  const [text, setText] = useState("https://replit.com");
  const [qrUrl, setQrUrl] = useState<string>("");

  useEffect(() => {
    if (text) {
      QRCode.toDataURL(text, { 
        width: 300, 
        margin: 2,
        color: { dark: '#0F172A', light: '#FFFFFF' }
      }).then(setQrUrl).catch(console.error);
    } else {
      setQrUrl("");
    }
  }, [text]);

  return (
    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
      <Card className="border-0 shadow-lg shadow-black/5 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>QR Code Generator</CardTitle>
          <CardDescription>Create scannable QR codes for links or text</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Enter URL or Text</Label>
            <Input 
              value={text} 
              onChange={(e) => setText(e.target.value)} 
              placeholder="e.g. https://google.com" 
              className="bg-background text-lg py-6" 
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-2xl bg-muted/10">
        {qrUrl ? (
          <div className="animate-in zoom-in-95 duration-300 space-y-6 flex flex-col items-center">
            <div className="p-4 bg-white rounded-2xl shadow-xl">
              <img src={qrUrl} alt="QR Code" className="w-48 h-48 md:w-64 md:h-64 rounded-lg" />
            </div>
            <Button asChild className="rounded-full shadow-lg shadow-primary/20 gap-2">
              <a href={qrUrl} download="qrcode.png">
                <Download className="w-4 h-4" /> Download QR
              </a>
            </Button>
          </div>
        ) : (
          <div className="text-muted-foreground text-center">
            Type something to generate your QR Code instantly.
          </div>
        )}
      </div>
    </div>
  );
}
