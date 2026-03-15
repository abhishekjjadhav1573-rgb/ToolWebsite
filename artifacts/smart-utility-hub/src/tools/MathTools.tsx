import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const ResultCard = ({ title, value, highlight = false }: { title: string, value: string, highlight?: boolean }) => (
  <div className={`p-4 rounded-xl border ${highlight ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border shadow-sm'}`}>
    <p className={`text-sm font-medium mb-1 ${highlight ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>{title}</p>
    <p className="text-2xl font-display font-bold tracking-tight">{value}</p>
  </div>
);

export function PercentageCalculator() {
  const [mode, setMode] = useState<"A" | "B" | "C">("A");
  const [val1, setVal1] = useState("20");
  const [val2, setVal2] = useState("150");
  const [result, setResult] = useState<string | null>(null);

  const calculate = () => {
    const x = parseFloat(val1);
    const y = parseFloat(val2);
    if (!isNaN(x) && !isNaN(y)) {
      if (mode === "A") setResult(`${(x / 100) * y}`);
      else if (mode === "B") setResult(`${(x / y) * 100}%`);
      else if (mode === "C") setResult(`${((y - x) / Math.abs(x)) * 100}%`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
      <Card className="border-0 shadow-lg shadow-black/5 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Percentage Calculator</CardTitle>
          <CardDescription>Multi-purpose percentage tool</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup value={mode} onValueChange={(v: any) => { setMode(v); setResult(null); }} className="space-y-3">
            <div className="flex items-center space-x-2 bg-muted/50 p-3 rounded-lg border">
              <RadioGroupItem value="A" id="mode-a" />
              <Label htmlFor="mode-a" className="cursor-pointer">What is X% of Y?</Label>
            </div>
            <div className="flex items-center space-x-2 bg-muted/50 p-3 rounded-lg border">
              <RadioGroupItem value="B" id="mode-b" />
              <Label htmlFor="mode-b" className="cursor-pointer">X is what % of Y?</Label>
            </div>
            <div className="flex items-center space-x-2 bg-muted/50 p-3 rounded-lg border">
              <RadioGroupItem value="C" id="mode-c" />
              <Label htmlFor="mode-c" className="cursor-pointer">% change from X to Y</Label>
            </div>
          </RadioGroup>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Value X</Label>
              <Input type="number" value={val1} onChange={(e) => setVal1(e.target.value)} className="bg-background" />
            </div>
            <div className="space-y-2">
              <Label>Value Y</Label>
              <Input type="number" value={val2} onChange={(e) => setVal2(e.target.value)} className="bg-background" />
            </div>
          </div>
          
          <Button onClick={calculate} className="w-full h-12 text-lg font-semibold rounded-xl">Calculate</Button>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {result ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
            <div className="p-8 rounded-2xl border border-primary bg-primary/5 text-center shadow-inner">
              <p className="text-muted-foreground font-medium mb-2">Result</p>
              <p className="text-5xl font-display font-black text-primary break-all">{result}</p>
            </div>
          </div>
        ) : (
          <div className="h-full border-2 border-dashed border-border rounded-2xl flex items-center justify-center text-muted-foreground p-8 text-center bg-muted/10">
            Select a mode and enter values to calculate.
          </div>
        )}
      </div>
    </div>
  );
}

export function ProfitLossCalculator() {
  const [cost, setCost] = useState<string>("1000");
  const [selling, setSelling] = useState<string>("1250");
  const [result, setResult] = useState<{ type: "Profit" | "Loss"; amount: number; percent: number } | null>(null);

  const calculate = () => {
    const cp = parseFloat(cost);
    const sp = parseFloat(selling);
    if (!isNaN(cp) && !isNaN(sp) && cp > 0) {
      const diff = sp - cp;
      setResult({
        type: diff >= 0 ? "Profit" : "Loss",
        amount: Math.abs(diff),
        percent: (Math.abs(diff) / cp) * 100,
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
      <Card className="border-0 shadow-lg shadow-black/5 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Profit &amp; Loss Calculator</CardTitle>
          <CardDescription>Determine profit or loss from cost and selling price</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Cost Price (₹)</Label>
            <Input type="number" value={cost} onChange={(e) => setCost(e.target.value)} className="bg-background" />
          </div>
          <div className="space-y-2">
            <Label>Selling Price (₹)</Label>
            <Input type="number" value={selling} onChange={(e) => setSelling(e.target.value)} className="bg-background" />
          </div>
          <Button onClick={calculate} className="w-full h-12 text-lg font-semibold rounded-xl">Calculate</Button>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {result ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
            <div className={`p-8 rounded-2xl border text-center shadow-inner ${result.type === "Profit" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
              <p className="text-sm font-medium text-muted-foreground mb-1">Result</p>
              <p className={`text-4xl font-display font-black ${result.type === "Profit" ? "text-green-600" : "text-red-600"}`}>{result.type}</p>
              <p className={`text-2xl font-bold mt-1 ${result.type === "Profit" ? "text-green-600" : "text-red-600"}`}>₹{result.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <ResultCard title={`${result.type} Percentage`} value={`${result.percent.toFixed(2)}%`} highlight />
            <ResultCard title="Cost Price" value={`₹${parseFloat(cost).toLocaleString('en-IN')}`} />
            <ResultCard title="Selling Price" value={`₹${parseFloat(selling).toLocaleString('en-IN')}`} />
          </div>
        ) : (
          <div className="h-full border-2 border-dashed border-border rounded-2xl flex items-center justify-center text-muted-foreground p-8 text-center bg-muted/10">
            Enter cost and selling price to see the result.
          </div>
        )}
      </div>
    </div>
  );
}

export function ScientificCalculator() {
  const [display, setDisplay] = useState<string>("0");
  const [expression, setExpression] = useState<string>("");
  const [justEvaluated, setJustEvaluated] = useState(false);

  const fmt = (n: number) => {
    if (!isFinite(n)) return "Error";
    const s = parseFloat(n.toPrecision(12)).toString();
    return s.length > 14 ? n.toExponential(6) : s;
  };

  const append = (val: string) => {
    if (justEvaluated) {
      setDisplay(val);
      setExpression(val);
      setJustEvaluated(false);
      return;
    }
    const next = display === "0" && ![".", "+", "-", "*", "/", "e+", "e-"].includes(val) ? val : display + val;
    setDisplay(next);
    setExpression(next);
  };

  const applyFn = (fn: (x: number) => number) => {
    const x = parseFloat(display);
    if (!isNaN(x)) { const r = fmt(fn(x)); setDisplay(r); setExpression(r); setJustEvaluated(true); }
  };

  const evaluate = () => {
    try {
      // Safe eval using Function
      // eslint-disable-next-line no-new-func
      const result = new Function(`"use strict"; return (${expression.replace(/\^/g, "**")})`)();
      const r = fmt(result);
      setDisplay(r);
      setExpression(r);
      setJustEvaluated(true);
    } catch {
      setDisplay("Error");
      setJustEvaluated(true);
    }
  };

  const clear = () => { setDisplay("0"); setExpression(""); setJustEvaluated(false); };
  const backspace = () => {
    if (display.length <= 1) { setDisplay("0"); setExpression("0"); return; }
    const next = display.slice(0, -1);
    setDisplay(next);
    setExpression(next);
  };

  type BtnDef = { label: string; action: () => void; variant?: "primary" | "operator" | "fn" | "clear" };
  const buttons: BtnDef[] = [
    { label: "AC", action: clear, variant: "clear" },
    { label: "⌫", action: backspace, variant: "operator" },
    { label: "(", action: () => append("("), variant: "operator" },
    { label: ")", action: () => append(")"), variant: "operator" },

    { label: "sin", action: () => applyFn(x => Math.sin(x * Math.PI / 180)), variant: "fn" },
    { label: "cos", action: () => applyFn(x => Math.cos(x * Math.PI / 180)), variant: "fn" },
    { label: "tan", action: () => applyFn(x => Math.tan(x * Math.PI / 180)), variant: "fn" },
    { label: "log", action: () => applyFn(Math.log10), variant: "fn" },

    { label: "ln", action: () => applyFn(Math.log), variant: "fn" },
    { label: "√", action: () => applyFn(Math.sqrt), variant: "fn" },
    { label: "x²", action: () => applyFn(x => x * x), variant: "fn" },
    { label: "xⁿ", action: () => append("^"), variant: "fn" },

    { label: "7", action: () => append("7") },
    { label: "8", action: () => append("8") },
    { label: "9", action: () => append("9") },
    { label: "÷", action: () => append("/"), variant: "operator" },

    { label: "4", action: () => append("4") },
    { label: "5", action: () => append("5") },
    { label: "6", action: () => append("6") },
    { label: "×", action: () => append("*"), variant: "operator" },

    { label: "1", action: () => append("1") },
    { label: "2", action: () => append("2") },
    { label: "3", action: () => append("3") },
    { label: "−", action: () => append("-"), variant: "operator" },

    { label: "0", action: () => append("0") },
    { label: ".", action: () => append(".") },
    { label: "=", action: evaluate, variant: "primary" },
    { label: "+", action: () => append("+"), variant: "operator" },
  ];

  const variantClass: Record<string, string> = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 col-span-1",
    operator: "bg-muted text-foreground hover:bg-muted/70 font-bold",
    fn: "bg-primary/10 text-primary hover:bg-primary/20 text-sm font-semibold",
    clear: "bg-destructive/10 text-destructive hover:bg-destructive/20 font-bold",
    default: "bg-background hover:bg-muted border border-border text-foreground font-medium",
  };

  return (
    <div className="max-w-sm mx-auto">
      <Card className="border-0 shadow-xl shadow-black/8 bg-card/60 backdrop-blur-sm overflow-hidden">
        <div className="bg-foreground/5 border-b p-4 text-right">
          <p className="text-muted-foreground text-xs h-5 truncate">{expression || " "}</p>
          <p className="text-4xl font-mono font-bold text-foreground mt-1 truncate">{display}</p>
        </div>
        <CardContent className="p-3">
          <div className="grid grid-cols-4 gap-2">
            {buttons.map((btn) => (
              <button
                key={btn.label}
                onClick={btn.action}
                className={`h-14 rounded-xl text-base transition-all active:scale-95 ${variantClass[btn.variant ?? "default"]}`}
              >
                {btn.label}
              </button>
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground mt-3">sin/cos/tan use degrees · xⁿ uses ^ operator</p>
        </CardContent>
      </Card>
    </div>
  );
}

export function AverageCalculator() {
  const [input, setInput] = useState("10, 25, 42, 8");
  const [result, setResult] = useState<{ avg: number, sum: number, min: number, max: number, count: number } | null>(null);

  const calculate = () => {
    const numbers = input.split(/[,;\s]+/).map(n => parseFloat(n)).filter(n => !isNaN(n));
    if (numbers.length > 0) {
      const sum = numbers.reduce((a, b) => a + b, 0);
      setResult({
        count: numbers.length,
        sum,
        avg: sum / numbers.length,
        min: Math.min(...numbers),
        max: Math.max(...numbers)
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
      <Card className="border-0 shadow-lg shadow-black/5 bg-card/50 backdrop-blur-sm flex flex-col">
        <CardHeader>
          <CardTitle>Average Calculator</CardTitle>
          <CardDescription>Find the mean of a dataset</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 flex-1 flex flex-col">
          <div className="space-y-2 flex-1 flex flex-col">
            <Label>Enter numbers (comma or space separated)</Label>
            <Textarea 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              className="flex-1 min-h-[150px] bg-background text-lg leading-relaxed" 
              placeholder="e.g. 10, 20, 30.5"
            />
          </div>
          <Button onClick={calculate} className="w-full h-12 text-lg font-semibold rounded-xl">Calculate Stats</Button>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {result ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <ResultCard title="Average (Mean)" value={result.avg.toFixed(2)} highlight />
            </div>
            <ResultCard title="Sum" value={result.sum.toFixed(2)} />
            <ResultCard title="Count" value={result.count.toString()} />
            <ResultCard title="Minimum" value={result.min.toString()} />
            <ResultCard title="Maximum" value={result.max.toString()} />
          </div>
        ) : (
          <div className="h-full border-2 border-dashed border-border rounded-2xl flex items-center justify-center text-muted-foreground p-8 text-center bg-muted/10">
            Paste your numbers to get statistical insights.
          </div>
        )}
      </div>
    </div>
  );
}
