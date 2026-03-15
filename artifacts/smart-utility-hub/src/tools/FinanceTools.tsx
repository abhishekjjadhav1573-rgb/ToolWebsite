import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IndianRupee } from "lucide-react";

const ResultCard = ({ title, value, highlight = false }: { title: string, value: string, highlight?: boolean }) => (
  <div className={`p-4 rounded-xl border ${highlight ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border shadow-sm'}`}>
    <p className={`text-sm font-medium mb-1 ${highlight ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>{title}</p>
    <p className="text-2xl font-display font-bold tracking-tight">{value}</p>
  </div>
);

export function EmiCalculator() {
  const [amount, setAmount] = useState<string>("500000");
  const [rate, setRate] = useState<string>("8.5");
  const [tenure, setTenure] = useState<string>("5");
  const [tenureType, setTenureType] = useState<"years" | "months">("years");
  const [result, setResult] = useState<{ emi: number, totalAmount: number, totalInterest: number } | null>(null);

  const calculate = () => {
    const p = parseFloat(amount);
    const r = parseFloat(rate) / 12 / 100;
    const n = tenureType === "years" ? parseFloat(tenure) * 12 : parseFloat(tenure);
    
    if (p > 0 && r > 0 && n > 0) {
      const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalAmount = emi * n;
      const totalInterest = totalAmount - p;
      setResult({ emi, totalAmount, totalInterest });
    }
  };

  return (
    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
      <Card className="border-0 shadow-lg shadow-black/5 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>EMI Calculator</CardTitle>
          <CardDescription>Calculate your equated monthly installment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Loan Amount (₹)</Label>
            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="text-lg bg-background" />
          </div>
          <div className="space-y-2">
            <Label>Interest Rate (% p.a.)</Label>
            <Input type="number" value={rate} onChange={(e) => setRate(e.target.value)} className="text-lg bg-background" />
          </div>
          <div className="space-y-2">
            <Label>Loan Tenure</Label>
            <div className="flex gap-4">
              <Input type="number" value={tenure} onChange={(e) => setTenure(e.target.value)} className="flex-1 text-lg bg-background" />
              <Select value={tenureType} onValueChange={(v: "years" | "months") => setTenureType(v)}>
                <SelectTrigger className="w-[120px] bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="years">Years</SelectItem>
                  <SelectItem value="months">Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={calculate} className="w-full h-12 text-lg font-semibold rounded-xl">Calculate EMI</Button>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {result ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
            <ResultCard title="Monthly EMI" value={`₹${Math.round(result.emi).toLocaleString('en-IN')}`} highlight />
            <ResultCard title="Principal Amount" value={`₹${parseFloat(amount).toLocaleString('en-IN')}`} />
            <ResultCard title="Total Interest" value={`₹${Math.round(result.totalInterest).toLocaleString('en-IN')}`} />
            <ResultCard title="Total Amount Payable" value={`₹${Math.round(result.totalAmount).toLocaleString('en-IN')}`} />
          </div>
        ) : (
          <div className="h-full border-2 border-dashed border-border rounded-2xl flex items-center justify-center text-muted-foreground p-8 text-center bg-muted/10">
            Enter your loan details and calculate to see the breakdown here.
          </div>
        )}
      </div>
    </div>
  );
}

export function SipCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState<string>("5000");
  const [rate, setRate] = useState<string>("12");
  const [years, setYears] = useState<string>("10");
  const [result, setResult] = useState<{ invested: number, estReturns: number, total: number } | null>(null);

  const calculate = () => {
    const P = parseFloat(monthlyInvestment);
    const i = parseFloat(rate) / 100 / 12;
    const n = parseFloat(years) * 12;

    if (P > 0 && i > 0 && n > 0) {
      const total = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
      const invested = P * n;
      const estReturns = total - invested;
      setResult({ invested, estReturns, total });
    }
  };

  return (
    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
      <Card className="border-0 shadow-lg shadow-black/5 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>SIP Calculator</CardTitle>
          <CardDescription>Estimate your mutual fund returns</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Monthly Investment (₹)</Label>
            <Input type="number" value={monthlyInvestment} onChange={(e) => setMonthlyInvestment(e.target.value)} className="bg-background" />
          </div>
          <div className="space-y-2">
            <Label>Expected Return Rate (% p.a.)</Label>
            <Input type="number" value={rate} onChange={(e) => setRate(e.target.value)} className="bg-background" />
          </div>
          <div className="space-y-2">
            <Label>Time Period (Years)</Label>
            <Input type="number" value={years} onChange={(e) => setYears(e.target.value)} className="bg-background" />
          </div>
          <Button onClick={calculate} className="w-full h-12 text-lg font-semibold rounded-xl">Calculate Returns</Button>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {result ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
            <ResultCard title="Total Value" value={`₹${Math.round(result.total).toLocaleString('en-IN')}`} highlight />
            <ResultCard title="Total Investment" value={`₹${Math.round(result.invested).toLocaleString('en-IN')}`} />
            <ResultCard title="Estimated Returns" value={`₹${Math.round(result.estReturns).toLocaleString('en-IN')}`} />
          </div>
        ) : (
          <div className="h-full border-2 border-dashed border-border rounded-2xl flex items-center justify-center text-muted-foreground p-8 text-center bg-muted/10">
            Enter your SIP details to view your projected wealth.
          </div>
        )}
      </div>
    </div>
  );
}

export function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState<string>("10000");
  const [rate, setRate] = useState<string>("5");
  const [years, setYears] = useState<string>("5");
  const [freq, setFreq] = useState<string>("12");
  const [result, setResult] = useState<{ amount: number, interest: number } | null>(null);

  const calculate = () => {
    const P = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const t = parseFloat(years);
    const n = parseFloat(freq);

    if (P > 0 && r > 0 && t > 0) {
      const amount = P * Math.pow(1 + r / n, n * t);
      const interest = amount - P;
      setResult({ amount, interest });
    }
  };

  return (
    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
      <Card className="border-0 shadow-lg shadow-black/5 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Compound Interest Calculator</CardTitle>
          <CardDescription>See how your money grows over time</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Principal Amount</Label>
            <Input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} className="bg-background" />
          </div>
          <div className="space-y-2">
            <Label>Interest Rate (% p.a.)</Label>
            <Input type="number" value={rate} onChange={(e) => setRate(e.target.value)} className="bg-background" />
          </div>
          <div className="space-y-2">
            <Label>Time Period (Years)</Label>
            <Input type="number" value={years} onChange={(e) => setYears(e.target.value)} className="bg-background" />
          </div>
          <div className="space-y-2">
            <Label>Compounding Frequency</Label>
            <Select value={freq} onValueChange={setFreq}>
              <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Annually</SelectItem>
                <SelectItem value="2">Semi-Annually</SelectItem>
                <SelectItem value="4">Quarterly</SelectItem>
                <SelectItem value="12">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={calculate} className="w-full h-12 text-lg font-semibold rounded-xl">Calculate Growth</Button>
        </CardContent>
      </Card>
      
      <div className="space-y-6">
        {result ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
            <ResultCard title="Total Value" value={`$${result.amount.toFixed(2)}`} highlight />
            <ResultCard title="Total Interest Earned" value={`$${result.interest.toFixed(2)}`} />
          </div>
        ) : (
          <div className="h-full border-2 border-dashed border-border rounded-2xl flex items-center justify-center text-muted-foreground p-8 text-center bg-muted/10">
            Enter your details to calculate compound interest.
          </div>
        )}
      </div>
    </div>
  );
}

export function GstCalculator() {
  const [amount, setAmount] = useState<string>("1000");
  const [rate, setRate] = useState<string>("18");
  const [mode, setMode] = useState<"add" | "remove">("add");
  const [result, setResult] = useState<{ original: number, gst: number, total: number } | null>(null);

  const calculate = () => {
    const a = parseFloat(amount);
    const r = parseFloat(rate);
    if (a > 0 && r >= 0) {
      if (mode === "add") {
        const gst = a * (r / 100);
        setResult({ original: a, gst, total: a + gst });
      } else {
        const original = a / (1 + r / 100);
        const gst = a - original;
        setResult({ original, gst, total: a });
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
      <Card className="border-0 shadow-lg shadow-black/5 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>GST Calculator</CardTitle>
          <CardDescription>Add or remove Goods and Services Tax</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Amount</Label>
            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="bg-background" />
          </div>
          <div className="space-y-2">
            <Label>GST Rate (%)</Label>
            <Select value={rate} onValueChange={setRate}>
              <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5%</SelectItem>
                <SelectItem value="12">12%</SelectItem>
                <SelectItem value="18">18%</SelectItem>
                <SelectItem value="28">28%</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <RadioGroup value={mode} onValueChange={(v: "add" | "remove") => setMode(v)} className="flex gap-6 py-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="add" id="add" />
              <Label htmlFor="add">Add GST</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="remove" id="remove" />
              <Label htmlFor="remove">Remove GST</Label>
            </div>
          </RadioGroup>
          <Button onClick={calculate} className="w-full h-12 text-lg font-semibold rounded-xl">Calculate GST</Button>
        </CardContent>
      </Card>
      
      <div className="space-y-6">
        {result ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
            <ResultCard title="Total Amount" value={result.total.toFixed(2)} highlight />
            <ResultCard title="Original Amount" value={result.original.toFixed(2)} />
            <ResultCard title="GST Amount" value={result.gst.toFixed(2)} />
          </div>
        ) : (
          <div className="h-full border-2 border-dashed border-border rounded-2xl flex items-center justify-center text-muted-foreground p-8 text-center bg-muted/10">
            Calculate your GST breakdown quickly.
          </div>
        )}
      </div>
    </div>
  );
}

export function IncomeTaxCalculator() {
  const [income, setIncome] = useState<string>("100000");
  const [taxPercent, setTaxPercent] = useState<string>("20");
  const [result, setResult] = useState<{ tax: number, net: number } | null>(null);

  const calculate = () => {
    const inc = parseFloat(income);
    const taxP = parseFloat(taxPercent);
    if (inc > 0 && taxP >= 0) {
      const tax = inc * (taxP / 100);
      setResult({ tax, net: inc - tax });
    }
  };

  return (
    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
      <Card className="border-0 shadow-lg shadow-black/5 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Flat Income Tax Calculator</CardTitle>
          <CardDescription>Estimate your take-home pay based on a flat percentage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Annual Income</Label>
            <Input type="number" value={income} onChange={(e) => setIncome(e.target.value)} className="bg-background" />
          </div>
          <div className="space-y-2">
            <Label>Tax Percentage (%)</Label>
            <Input type="number" value={taxPercent} onChange={(e) => setTaxPercent(e.target.value)} className="bg-background" />
          </div>
          <Button onClick={calculate} className="w-full h-12 text-lg font-semibold rounded-xl">Calculate Take-Home</Button>
        </CardContent>
      </Card>
      
      <div className="space-y-6">
        {result ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
            <ResultCard title="Take-Home Income" value={`$${result.net.toLocaleString()}`} highlight />
            <ResultCard title="Total Tax" value={`$${result.tax.toLocaleString()}`} />
          </div>
        ) : (
          <div className="h-full border-2 border-dashed border-border rounded-2xl flex items-center justify-center text-muted-foreground p-8 text-center bg-muted/10">
            Calculate your estimated post-tax income.
          </div>
        )}
      </div>
    </div>
  );
}
