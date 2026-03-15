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
