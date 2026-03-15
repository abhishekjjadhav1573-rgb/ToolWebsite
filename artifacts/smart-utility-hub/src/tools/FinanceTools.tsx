import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/* ─── Shared helpers ─── */

const fmt = (n: number, decimals = 2) =>
  n.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

const fmtINR = (n: number) => `₹${fmt(Math.round(n))}`;

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="space-y-2">
    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70 pb-1 border-b border-border">{title}</p>
    {children}
  </div>
);

const Row = ({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) => (
  <div className="flex items-center justify-between gap-2 py-1">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className={`text-sm font-semibold tabular-nums ${accent ? "text-primary" : "text-foreground"}`}>{value}</span>
  </div>
);

const Hero = ({ label, value, sub }: { label: string; value: string; sub?: string }) => (
  <div className="bg-primary/8 border border-primary/20 rounded-2xl p-5 text-center">
    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
    <p className="text-3xl font-display font-black text-primary">{value}</p>
    {sub && <p className="text-sm text-muted-foreground mt-1">{sub}</p>}
  </div>
);

const BarSplit = ({ leftLabel, leftPct, rightLabel }: { leftLabel: string; leftPct: number; rightLabel: string }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between text-xs text-muted-foreground">
      <span>{leftLabel} ({leftPct.toFixed(1)}%)</span>
      <span>{rightLabel} ({(100 - leftPct).toFixed(1)}%)</span>
    </div>
    <div className="h-2.5 rounded-full bg-muted overflow-hidden flex">
      <div className="bg-primary rounded-l-full transition-all" style={{ width: `${leftPct}%` }} />
      <div className="bg-primary/25 rounded-r-full flex-1" />
    </div>
  </div>
);

const EmptyPanel = ({ text }: { text: string }) => (
  <div className="h-full min-h-[220px] border-2 border-dashed border-border rounded-2xl flex items-center justify-center text-muted-foreground p-8 text-center bg-muted/10 text-sm">{text}</div>
);

const ResultPanel = ({ children }: { children: React.ReactNode }) => (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-5 bg-card/60 border border-border rounded-2xl p-5 shadow-sm">{children}</div>
);

/* ─── EMI Calculator ─── */

export function EmiCalculator() {
  const [amount, setAmount] = useState("500000");
  const [rate, setRate] = useState("8.5");
  const [tenure, setTenure] = useState("5");
  const [tenureType, setTenureType] = useState<"years" | "months">("years");
  const [result, setResult] = useState<{
    emi: number; totalAmount: number; totalInterest: number; n: number; p: number;
  } | null>(null);

  const calculate = () => {
    const p = parseFloat(amount);
    const r = parseFloat(rate) / 12 / 100;
    const n = tenureType === "years" ? parseFloat(tenure) * 12 : parseFloat(tenure);
    if (p > 0 && r > 0 && n > 0) {
      const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      setResult({ emi, totalAmount: emi * n, totalInterest: emi * n - p, n, p });
    }
  };

  const principalPct = result ? (result.p / result.totalAmount) * 100 : 0;
  const interestRatio = result ? ((result.totalInterest / result.p) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto grid md:grid-cols-[380px_1fr] gap-8">
      <Card className="border-0 shadow-lg shadow-black/5 bg-card/50 backdrop-blur-sm h-fit">
        <CardHeader>
          <CardTitle>EMI Calculator</CardTitle>
          <CardDescription>Calculate your equated monthly installment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label>Loan Amount (₹)</Label>
            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="bg-background" />
          </div>
          <div className="space-y-2">
            <Label>Interest Rate (% p.a.)</Label>
            <Input type="number" value={rate} onChange={(e) => setRate(e.target.value)} className="bg-background" />
          </div>
          <div className="space-y-2">
            <Label>Loan Tenure</Label>
            <div className="flex gap-3">
              <Input type="number" value={tenure} onChange={(e) => setTenure(e.target.value)} className="flex-1 bg-background" />
              <Select value={tenureType} onValueChange={(v: "years" | "months") => setTenureType(v)}>
                <SelectTrigger className="w-[110px] bg-background"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="years">Years</SelectItem>
                  <SelectItem value="months">Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={calculate} className="w-full h-11 font-semibold rounded-xl">Calculate EMI</Button>
        </CardContent>
      </Card>

      {result ? (
        <ResultPanel>
          <Hero label="Monthly EMI" value={fmtINR(result.emi)} sub={`for ${result.n} months`} />

          <Section title="Loan Cost Summary">
            <Row label="Principal (Loan Amount)" value={fmtINR(result.p)} />
            <Row label="Total Interest Payable" value={fmtINR(result.totalInterest)} accent />
            <Row label="Total Payment (Principal + Interest)" value={fmtINR(result.totalAmount)} />
          </Section>

          <Section title="Payment Breakdown">
            <BarSplit leftLabel="Principal" leftPct={principalPct} rightLabel="Interest" />
            <Row label="Interest-to-Principal Ratio" value={`${interestRatio.toFixed(1)}%`} />
            <Row label="Interest as % of Total Payment" value={`${(100 - principalPct).toFixed(1)}%`} />
          </Section>

          <Section title="Monthly Breakdown (1st Payment)">
            <Row label="Principal Component" value={fmtINR(result.emi - (result.p * parseFloat(rate) / 12 / 100))} />
            <Row label="Interest Component" value={fmtINR(result.p * parseFloat(rate) / 12 / 100)} accent />
          </Section>
        </ResultPanel>
      ) : (
        <EmptyPanel text="Enter your loan details and calculate to see the full breakdown." />
      )}
    </div>
  );
}

/* ─── SIP Calculator ─── */

export function SipCalculator() {
  const [monthly, setMonthly] = useState("5000");
  const [rate, setRate] = useState("12");
  const [years, setYears] = useState("10");
  const [result, setResult] = useState<{
    invested: number; returns: number; total: number; cagr: number; growthPct: number; yr: { y: number; val: number }[];
  } | null>(null);

  const calculate = () => {
    const P = parseFloat(monthly);
    const i = parseFloat(rate) / 100 / 12;
    const n = parseFloat(years) * 12;
    if (P > 0 && i > 0 && n > 0) {
      const total = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
      const invested = P * n;
      const cagr = (Math.pow(total / invested, 1 / parseFloat(years)) - 1) * 100;
      const yr: { y: number; val: number }[] = [];
      for (let y = 1; y <= Math.min(parseFloat(years), 10); y++) {
        const mn = y * 12;
        yr.push({ y, val: P * ((Math.pow(1 + i, mn) - 1) / i) * (1 + i) });
      }
      setResult({ invested, returns: total - invested, total, cagr, growthPct: ((total - invested) / invested) * 100, yr });
    }
  };

  return (
    <div className="max-w-5xl mx-auto grid md:grid-cols-[380px_1fr] gap-8">
      <Card className="border-0 shadow-lg shadow-black/5 bg-card/50 backdrop-blur-sm h-fit">
        <CardHeader>
          <CardTitle>SIP Calculator</CardTitle>
          <CardDescription>Estimate your mutual fund SIP returns</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label>Monthly Investment (₹)</Label>
            <Input type="number" value={monthly} onChange={(e) => setMonthly(e.target.value)} className="bg-background" />
          </div>
          <div className="space-y-2">
            <Label>Expected Return Rate (% p.a.)</Label>
            <Input type="number" value={rate} onChange={(e) => setRate(e.target.value)} className="bg-background" />
          </div>
          <div className="space-y-2">
            <Label>Investment Duration (Years)</Label>
            <Input type="number" value={years} onChange={(e) => setYears(e.target.value)} className="bg-background" />
          </div>
          <Button onClick={calculate} className="w-full h-11 font-semibold rounded-xl">Calculate Returns</Button>
        </CardContent>
      </Card>

      {result ? (
        <ResultPanel>
          <Hero label="Final Maturity Value" value={fmtINR(result.total)} sub={`after ${years} years`} />

          <Section title="Investment Summary">
            <Row label="Total Amount Invested" value={fmtINR(result.invested)} />
            <Row label="Estimated Returns" value={fmtINR(result.returns)} accent />
            <Row label="Wealth Gain" value={fmtINR(result.returns)} />
          </Section>

          <Section title="Growth Metrics">
            <BarSplit leftLabel="Invested" leftPct={(result.invested / result.total) * 100} rightLabel="Returns" />
            <Row label="CAGR (Compound Annual Growth Rate)" value={`${result.cagr.toFixed(2)}%`} accent />
            <Row label="Investment Growth" value={`${result.growthPct.toFixed(1)}%`} />
          </Section>

          {result.yr.length > 0 && (
            <Section title={`Yearly Growth (First ${result.yr.length} Years)`}>
              {result.yr.map(({ y, val }) => (
                <Row key={y} label={`Year ${y}`} value={fmtINR(val)} />
              ))}
            </Section>
          )}
        </ResultPanel>
      ) : (
        <EmptyPanel text="Enter your SIP details to view projected wealth and growth breakdown." />
      )}
    </div>
  );
}

/* ─── Compound Interest Calculator ─── */

export function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState("100000");
  const [rate, setRate] = useState("8");
  const [years, setYears] = useState("5");
  const [freq, setFreq] = useState("4");
  const [result, setResult] = useState<{
    amount: number; interest: number; ear: number; growthPct: number; doubling: number;
    yearlyData: { y: number; val: number; int: number }[];
  } | null>(null);

  const calculate = () => {
    const P = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const t = parseFloat(years);
    const n = parseFloat(freq);
    if (P > 0 && r > 0 && t > 0 && n > 0) {
      const amount = P * Math.pow(1 + r / n, n * t);
      const ear = (Math.pow(1 + r / n, n) - 1) * 100;
      const yearlyData: { y: number; val: number; int: number }[] = [];
      for (let y = 1; y <= Math.min(t, 8); y++) {
        const val = P * Math.pow(1 + r / n, n * y);
        yearlyData.push({ y, val, int: val - P });
      }
      setResult({ amount, interest: amount - P, ear, growthPct: ((amount - P) / P) * 100, doubling: Math.log(2) / Math.log(1 + r / n) / n, yearlyData });
    }
  };

  const freqLabel: Record<string, string> = { "1": "Annually", "2": "Semi-Annually", "4": "Quarterly", "12": "Monthly" };

  return (
    <div className="max-w-5xl mx-auto grid md:grid-cols-[380px_1fr] gap-8">
      <Card className="border-0 shadow-lg shadow-black/5 bg-card/50 backdrop-blur-sm h-fit">
        <CardHeader>
          <CardTitle>Compound Interest Calculator</CardTitle>
          <CardDescription>See how your money grows with compounding</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label>Principal Amount (₹)</Label>
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
          <Button onClick={calculate} className="w-full h-11 font-semibold rounded-xl">Calculate Growth</Button>
        </CardContent>
      </Card>

      {result ? (
        <ResultPanel>
          <Hero label="Final Value" value={fmtINR(result.amount)} sub={`compounded ${freqLabel[freq]?.toLowerCase()}`} />

          <Section title="Interest Summary">
            <Row label="Principal Amount" value={fmtINR(parseFloat(principal))} />
            <Row label="Total Interest Earned" value={fmtINR(result.interest)} accent />
          </Section>

          <Section title="Growth Metrics">
            <BarSplit leftLabel="Principal" leftPct={(parseFloat(principal) / result.amount) * 100} rightLabel="Interest" />
            <Row label="Effective Annual Rate (EAR)" value={`${result.ear.toFixed(3)}%`} accent />
            <Row label="Nominal Rate" value={`${rate}% p.a.`} />
            <Row label="Overall Growth" value={`${result.growthPct.toFixed(2)}%`} />
            <Row label="Doubling Time (approx.)" value={`${result.doubling.toFixed(1)} years`} />
          </Section>

          {result.yearlyData.length > 0 && (
            <Section title={`Year-by-Year Breakdown (${result.yearlyData.length} Years)`}>
              {result.yearlyData.map(({ y, val, int }) => (
                <div key={y} className="flex items-center justify-between text-sm py-0.5">
                  <span className="text-muted-foreground">Year {y}</span>
                  <span className="font-medium">{fmtINR(val)}</span>
                  <span className="text-primary text-xs">+{fmtINR(int)}</span>
                </div>
              ))}
            </Section>
          )}
        </ResultPanel>
      ) : (
        <EmptyPanel text="Enter your details to calculate compound interest with growth breakdown." />
      )}
    </div>
  );
}

/* ─── GST Calculator ─── */

export function GstCalculator() {
  const [amount, setAmount] = useState("10000");
  const [rate, setRate] = useState("18");
  const [mode, setMode] = useState<"add" | "remove">("add");
  const [result, setResult] = useState<{
    base: number; gst: number; total: number; cgst: number; sgst: number; igst: number; taxImpact: number;
  } | null>(null);

  const calculate = () => {
    const a = parseFloat(amount);
    const r = parseFloat(rate);
    if (a > 0 && r >= 0) {
      let base: number, gst: number, total: number;
      if (mode === "add") { base = a; gst = a * (r / 100); total = a + gst; }
      else { base = a / (1 + r / 100); gst = a - base; total = a; }
      setResult({ base, gst, total, cgst: gst / 2, sgst: gst / 2, igst: gst, taxImpact: (gst / total) * 100 });
    }
  };

  return (
    <div className="max-w-5xl mx-auto grid md:grid-cols-[380px_1fr] gap-8">
      <Card className="border-0 shadow-lg shadow-black/5 bg-card/50 backdrop-blur-sm h-fit">
        <CardHeader>
          <CardTitle>GST Calculator</CardTitle>
          <CardDescription>Add or remove Goods &amp; Services Tax</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label>Amount (₹)</Label>
            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="bg-background" />
          </div>
          <div className="space-y-2">
            <Label>GST Rate (%)</Label>
            <Select value={rate} onValueChange={setRate}>
              <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="0.25">0.25%</SelectItem>
                <SelectItem value="3">3%</SelectItem>
                <SelectItem value="5">5%</SelectItem>
                <SelectItem value="12">12%</SelectItem>
                <SelectItem value="18">18%</SelectItem>
                <SelectItem value="28">28%</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <RadioGroup value={mode} onValueChange={(v: "add" | "remove") => setMode(v)} className="flex gap-6 py-1">
            <div className="flex items-center gap-2"><RadioGroupItem value="add" id="g-add" /><Label htmlFor="g-add">Add GST</Label></div>
            <div className="flex items-center gap-2"><RadioGroupItem value="remove" id="g-remove" /><Label htmlFor="g-remove">Remove GST</Label></div>
          </RadioGroup>
          <Button onClick={calculate} className="w-full h-11 font-semibold rounded-xl">Calculate GST</Button>
        </CardContent>
      </Card>

      {result ? (
        <ResultPanel>
          <Hero label={mode === "add" ? "Final Amount (with GST)" : "Base Amount (ex-GST)"} value={`₹${fmt(result.total)}`} sub={`GST @ ${rate}%`} />

          <Section title="Calculation Summary">
            <Row label="Base Amount (Pre-Tax)" value={`₹${fmt(result.base)}`} />
            <Row label="GST Amount" value={`₹${fmt(result.gst)}`} accent />
            <Row label="Final Amount (Inc. GST)" value={`₹${fmt(result.total)}`} />
          </Section>

          <Section title="GST Breakdown">
            <div className="text-xs text-muted-foreground mb-2 italic">Intra-State (CGST + SGST)</div>
            <Row label={`CGST (${parseFloat(rate) / 2}%)`} value={`₹${fmt(result.cgst)}`} />
            <Row label={`SGST (${parseFloat(rate) / 2}%)`} value={`₹${fmt(result.sgst)}`} />
            <div className="border-t my-2" />
            <div className="text-xs text-muted-foreground mb-2 italic">Inter-State (IGST)</div>
            <Row label={`IGST (${rate}%)`} value={`₹${fmt(result.igst)}`} accent />
          </Section>

          <Section title="Tax Impact">
            <BarSplit leftLabel="Base" leftPct={100 - result.taxImpact} rightLabel="GST" />
            <Row label="Tax as % of Final Amount" value={`${result.taxImpact.toFixed(2)}%`} />
            <Row label="Tax Rate Applied" value={`${rate}%`} />
          </Section>
        </ResultPanel>
      ) : (
        <EmptyPanel text="Enter an amount and select GST rate to see the complete tax breakdown." />
      )}
    </div>
  );
}

/* ─── Income Tax Calculator ─── */

export function IncomeTaxCalculator() {
  const [income, setIncome] = useState("1000000");
  const [taxPercent, setTaxPercent] = useState("20");
  const [std, setStd] = useState("50000");
  const [deductions, setDeductions] = useState("150000");
  const [result, setResult] = useState<{
    gross: number; stdDed: number; sec80C: number; taxable: number; tax: number; net: number;
    effectiveRate: number; monthlyNet: number; monthlyTax: number;
  } | null>(null);

  const calculate = () => {
    const gross = parseFloat(income);
    const taxP = parseFloat(taxPercent);
    const stdDed = Math.min(parseFloat(std) || 0, gross);
    const sec80C = Math.min(parseFloat(deductions) || 0, 150000);
    if (gross > 0 && taxP >= 0) {
      const taxable = Math.max(gross - stdDed - sec80C, 0);
      const tax = taxable * (taxP / 100);
      const net = gross - tax;
      setResult({ gross, stdDed, sec80C, taxable, tax, net, effectiveRate: (tax / gross) * 100, monthlyNet: net / 12, monthlyTax: tax / 12 });
    }
  };

  return (
    <div className="max-w-5xl mx-auto grid md:grid-cols-[380px_1fr] gap-8">
      <Card className="border-0 shadow-lg shadow-black/5 bg-card/50 backdrop-blur-sm h-fit">
        <CardHeader>
          <CardTitle>Income Tax Calculator</CardTitle>
          <CardDescription>Estimate your tax liability and take-home</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label>Annual Gross Income (₹)</Label>
            <Input type="number" value={income} onChange={(e) => setIncome(e.target.value)} className="bg-background" />
          </div>
          <div className="space-y-2">
            <Label>Tax Rate (%)</Label>
            <Input type="number" value={taxPercent} onChange={(e) => setTaxPercent(e.target.value)} className="bg-background" />
          </div>
          <div className="space-y-2">
            <Label>Standard Deduction (₹)</Label>
            <Input type="number" value={std} onChange={(e) => setStd(e.target.value)} className="bg-background" />
          </div>
          <div className="space-y-2">
            <Label>80C Deductions (₹, max 1,50,000)</Label>
            <Input type="number" value={deductions} onChange={(e) => setDeductions(e.target.value)} className="bg-background" />
          </div>
          <Button onClick={calculate} className="w-full h-11 font-semibold rounded-xl">Calculate Tax</Button>
        </CardContent>
      </Card>

      {result ? (
        <ResultPanel>
          <Hero label="Net Income After Tax" value={fmtINR(result.net)} sub={`Monthly take-home: ${fmtINR(result.monthlyNet)}`} />

          <Section title="Tax Summary">
            <Row label="Gross Annual Income" value={fmtINR(result.gross)} />
            <Row label="Standard Deduction" value={`– ${fmtINR(result.stdDed)}`} />
            <Row label="80C Deductions" value={`– ${fmtINR(result.sec80C)}`} />
            <Row label="Taxable Income" value={fmtINR(result.taxable)} accent />
          </Section>

          <Section title="Tax Breakdown">
            <BarSplit leftLabel="Take-Home" leftPct={(result.net / result.gross) * 100} rightLabel="Tax" />
            <Row label="Total Tax Payable" value={fmtINR(result.tax)} accent />
            <Row label="Monthly Tax Deduction (TDS)" value={fmtINR(result.monthlyTax)} />
            <Row label="Effective Tax Rate" value={`${result.effectiveRate.toFixed(2)}%`} />
            <Row label="Applied Tax Rate" value={`${taxPercent}%`} />
          </Section>

          <Section title="Monthly Income Details">
            <Row label="Monthly Gross" value={fmtINR(result.gross / 12)} />
            <Row label="Monthly Tax" value={fmtINR(result.monthlyTax)} />
            <Row label="Monthly Net Take-Home" value={fmtINR(result.monthlyNet)} accent />
          </Section>
        </ResultPanel>
      ) : (
        <EmptyPanel text="Enter your income and tax rate to see the full tax breakdown." />
      )}
    </div>
  );
}

/* ─── FD Calculator ─── */

export function FdCalculator() {
  const [principal, setPrincipal] = useState("100000");
  const [rate, setRate] = useState("7.5");
  const [years, setYears] = useState("5");
  const [freq, setFreq] = useState("4");
  const [result, setResult] = useState<{
    maturity: number; interest: number; ear: number; growthPct: number;
    yearlyData: { y: number; val: number }[];
  } | null>(null);

  const calculate = () => {
    const P = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const t = parseFloat(years);
    const n = parseFloat(freq);
    if (P > 0 && r > 0 && t > 0 && n > 0) {
      const maturity = P * Math.pow(1 + r / n, n * t);
      const ear = (Math.pow(1 + r / n, n) - 1) * 100;
      const yearlyData: { y: number; val: number }[] = [];
      for (let y = 1; y <= Math.min(t, 8); y++) {
        yearlyData.push({ y, val: P * Math.pow(1 + r / n, n * y) });
      }
      setResult({ maturity, interest: maturity - P, ear, growthPct: ((maturity - P) / P) * 100, yearlyData });
    }
  };

  const freqLabel: Record<string, string> = { "1": "Annually", "2": "Semi-Annually", "4": "Quarterly", "12": "Monthly" };

  return (
    <div className="max-w-5xl mx-auto grid md:grid-cols-[380px_1fr] gap-8">
      <Card className="border-0 shadow-lg shadow-black/5 bg-card/50 backdrop-blur-sm h-fit">
        <CardHeader>
          <CardTitle>FD Calculator</CardTitle>
          <CardDescription>Calculate Fixed Deposit maturity and returns</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label>Principal Amount (₹)</Label>
            <Input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} className="bg-background" />
          </div>
          <div className="space-y-2">
            <Label>Annual Interest Rate (%)</Label>
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
          <Button onClick={calculate} className="w-full h-11 font-semibold rounded-xl">Calculate Maturity</Button>
        </CardContent>
      </Card>

      {result ? (
        <ResultPanel>
          <Hero label="Maturity Value" value={fmtINR(result.maturity)} sub={`after ${years} years · ${freqLabel[freq]} compounding`} />

          <Section title="FD Summary">
            <Row label="Total Deposit (Principal)" value={fmtINR(parseFloat(principal))} />
            <Row label="Interest Earned" value={fmtINR(result.interest)} accent />
            <Row label="Maturity Value" value={fmtINR(result.maturity)} />
          </Section>

          <Section title="Growth Metrics">
            <BarSplit leftLabel="Principal" leftPct={(parseFloat(principal) / result.maturity) * 100} rightLabel="Interest" />
            <Row label="Nominal Rate (p.a.)" value={`${rate}%`} />
            <Row label="Effective Annual Yield (EAR)" value={`${result.ear.toFixed(3)}%`} accent />
            <Row label="Overall Growth" value={`${result.growthPct.toFixed(2)}%`} />
          </Section>

          {result.yearlyData.length > 0 && (
            <Section title={`Interest Breakdown (Year by Year)`}>
              {result.yearlyData.map(({ y, val }) => (
                <Row key={y} label={`End of Year ${y}`} value={fmtINR(val)} />
              ))}
            </Section>
          )}
        </ResultPanel>
      ) : (
        <EmptyPanel text="Enter your FD details to see the complete maturity and growth breakdown." />
      )}
    </div>
  );
}

/* ─── RD Calculator ─── */

export function RdCalculator() {
  const [monthly, setMonthly] = useState("5000");
  const [rate, setRate] = useState("7");
  const [years, setYears] = useState("5");
  const [result, setResult] = useState<{
    maturity: number; invested: number; interest: number; effectiveRate: number; growthPct: number;
  } | null>(null);

  const calculate = () => {
    const P = parseFloat(monthly);
    const r = parseFloat(rate) / 100 / 4;
    const n = parseFloat(years) * 12;
    if (P > 0 && r > 0 && n > 0) {
      let maturity = 0;
      for (let i = 1; i <= n; i++) maturity += P * Math.pow(1 + r, Math.ceil(i / 3));
      const invested = P * n;
      const t = parseFloat(years);
      const effectiveRate = (Math.pow(maturity / invested, 1 / t) - 1) * 100;
      setResult({ maturity, invested, interest: maturity - invested, effectiveRate, growthPct: ((maturity - invested) / invested) * 100 });
    }
  };

  return (
    <div className="max-w-5xl mx-auto grid md:grid-cols-[380px_1fr] gap-8">
      <Card className="border-0 shadow-lg shadow-black/5 bg-card/50 backdrop-blur-sm h-fit">
        <CardHeader>
          <CardTitle>RD Calculator</CardTitle>
          <CardDescription>Calculate Recurring Deposit maturity value</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label>Monthly Deposit (₹)</Label>
            <Input type="number" value={monthly} onChange={(e) => setMonthly(e.target.value)} className="bg-background" />
          </div>
          <div className="space-y-2">
            <Label>Annual Interest Rate (%)</Label>
            <Input type="number" value={rate} onChange={(e) => setRate(e.target.value)} className="bg-background" />
          </div>
          <div className="space-y-2">
            <Label>Time Period (Years)</Label>
            <Input type="number" value={years} onChange={(e) => setYears(e.target.value)} className="bg-background" />
          </div>
          <Button onClick={calculate} className="w-full h-11 font-semibold rounded-xl">Calculate Maturity</Button>
        </CardContent>
      </Card>

      {result ? (
        <ResultPanel>
          <Hero label="Maturity Value" value={fmtINR(result.maturity)} sub={`Total of ${parseInt(years) * 12} monthly deposits`} />

          <Section title="Investment Summary">
            <Row label="Monthly Deposit" value={fmtINR(parseFloat(monthly))} />
            <Row label="Total Amount Invested" value={fmtINR(result.invested)} />
            <Row label="Total Interest Earned" value={fmtINR(result.interest)} accent />
            <Row label="Maturity Value" value={fmtINR(result.maturity)} />
          </Section>

          <Section title="Return Metrics">
            <BarSplit leftLabel="Invested" leftPct={(result.invested / result.maturity) * 100} rightLabel="Returns" />
            <Row label="Effective Return Rate (CAGR)" value={`${result.effectiveRate.toFixed(2)}%`} accent />
            <Row label="Investment Growth" value={`${result.growthPct.toFixed(2)}%`} />
            <Row label="Nominal Rate Applied" value={`${rate}% p.a.`} />
          </Section>
        </ResultPanel>
      ) : (
        <EmptyPanel text="Enter your RD details to see projected maturity and returns." />
      )}
    </div>
  );
}
