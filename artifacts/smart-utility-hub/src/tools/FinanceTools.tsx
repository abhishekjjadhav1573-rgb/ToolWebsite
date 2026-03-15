import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  BarChart, Bar, Legend,
} from "recharts";

/* ─── Chart colour palette ─── */
const C = {
  blue:  "#3b82f6",
  light: "#bfdbfe",
  green: "#10b981",
  lgreen:"#a7f3d0",
  red:   "#ef4444",
  amber: "#f59e0b",
  slate: "#94a3b8",
};

/* ─── Shared helpers ─── */
const fmt  = (n: number, d = 2) => n.toLocaleString("en-IN", { minimumFractionDigits: d, maximumFractionDigits: d });
const fmtI = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 pb-1 border-b border-border">{title}</p>
    {children}
  </div>
);

const Row = ({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) => (
  <div className="flex items-center justify-between gap-2 py-0.5">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className={`text-sm font-semibold tabular-nums ${accent ? "text-primary" : "text-foreground"}`}>{value}</span>
  </div>
);

const Hero = ({ label, value, sub }: { label: string; value: string; sub?: string }) => (
  <div className="bg-primary/8 border border-primary/20 rounded-2xl p-4 text-center">
    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
    <p className="text-3xl font-display font-black text-primary leading-none">{value}</p>
    {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
  </div>
);

const SplitBar = ({ leftLabel, leftPct, rightLabel, leftColor = C.blue, rightColor = C.light }:
  { leftLabel: string; leftPct: number; rightLabel: string; leftColor?: string; rightColor?: string }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-xs text-muted-foreground">
      <span>{leftLabel} ({leftPct.toFixed(1)}%)</span>
      <span>{rightLabel} ({(100 - leftPct).toFixed(1)}%)</span>
    </div>
    <div className="h-2 rounded-full bg-muted overflow-hidden flex">
      <div className="rounded-l-full transition-all" style={{ width: `${leftPct}%`, background: leftColor }} />
      <div className="flex-1 rounded-r-full" style={{ background: rightColor }} />
    </div>
  </div>
);

const EmptyPanel = ({ text }: { text: string }) => (
  <div className="min-h-[200px] border-2 border-dashed border-border rounded-2xl flex items-center justify-center text-muted-foreground p-8 text-center bg-muted/10 text-sm">{text}</div>
);

const ResultPanel = ({ children }: { children: React.ReactNode }) => (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4 bg-card/60 border border-border rounded-2xl p-5 shadow-sm">{children}</div>
);

const ChartWrap = ({ children, title }: { children: React.ReactNode; title: string }) => (
  <div className="space-y-2">
    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 pb-1 border-b border-border">{title}</p>
    <div style={{ height: 170 }}>{children}</div>
  </div>
);

const DonutTooltip = ({ active, payload }: any) =>
  active && payload?.length ? (
    <div className="bg-card border border-border rounded-lg px-3 py-1.5 text-xs shadow-lg">
      <span className="font-semibold">{payload[0].name}:</span> {fmtI(payload[0].value)}
    </div>
  ) : null;

const LineTooltip = ({ active, payload, label }: any) =>
  active && payload?.length ? (
    <div className="bg-card border border-border rounded-lg px-3 py-1.5 text-xs shadow-lg space-y-0.5">
      <p className="font-semibold text-muted-foreground">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }}>{p.name}: {fmtI(p.value)}</p>
      ))}
    </div>
  ) : null;

/* ─── EMI Calculator ─── */
export function EmiCalculator() {
  const [amount, setAmount] = useState("500000");
  const [rate, setRate]     = useState("8.5");
  const [tenure, setTenure] = useState("5");
  const [tenureType, setTenureType] = useState<"years"|"months">("years");
  const [result, setResult] = useState<{ emi: number; total: number; interest: number; n: number; p: number } | null>(null);

  const calculate = () => {
    const p = parseFloat(amount), r = parseFloat(rate) / 12 / 100;
    const n = tenureType === "years" ? parseFloat(tenure) * 12 : parseFloat(tenure);
    if (p > 0 && r > 0 && n > 0) {
      const emi   = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const total = emi * n;
      setResult({ emi, total, interest: total - p, n, p });
    }
  };

  const pieData = result
    ? [{ name: "Principal", value: result.p }, { name: "Interest", value: result.interest }]
    : [];

  return (
    <div className="max-w-5xl mx-auto grid md:grid-cols-[370px_1fr] gap-8">
      <Card className="border-0 shadow-lg shadow-black/5 bg-card/50 backdrop-blur-sm h-fit">
        <CardHeader><CardTitle>EMI Calculator</CardTitle><CardDescription>Calculate your equated monthly installment</CardDescription></CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2"><Label>Loan Amount (₹)</Label><Input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="bg-background" /></div>
          <div className="space-y-2"><Label>Interest Rate (% p.a.)</Label><Input type="number" value={rate} onChange={e => setRate(e.target.value)} className="bg-background" /></div>
          <div className="space-y-2">
            <Label>Loan Tenure</Label>
            <div className="flex gap-3">
              <Input type="number" value={tenure} onChange={e => setTenure(e.target.value)} className="flex-1 bg-background" />
              <Select value={tenureType} onValueChange={(v: "years"|"months") => setTenureType(v)}>
                <SelectTrigger className="w-[110px] bg-background"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="years">Years</SelectItem><SelectItem value="months">Months</SelectItem></SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={calculate} className="w-full h-11 font-semibold rounded-xl">Calculate EMI</Button>
        </CardContent>
      </Card>

      {result ? (
        <ResultPanel>
          <Hero label="Monthly EMI" value={fmtI(result.emi)} sub={`for ${result.n} months`} />
          <Section title="Loan Cost Summary">
            <Row label="Principal Amount"            value={fmtI(result.p)} />
            <Row label="Total Interest Payable"      value={fmtI(result.interest)} accent />
            <Row label="Total Payment"               value={fmtI(result.total)} />
            <Row label="Interest-to-Principal Ratio" value={`${((result.interest / result.p) * 100).toFixed(1)}%`} />
          </Section>
          <Section title="Payment Breakdown">
            <SplitBar leftLabel="Principal" leftPct={(result.p / result.total) * 100} rightLabel="Interest" />
          </Section>
          <ChartWrap title="Payment Split (Donut)">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={72} paddingAngle={3} dataKey="value" stroke="none">
                  <Cell fill={C.blue} /><Cell fill={C.light} />
                </Pie>
                <Tooltip content={<DonutTooltip />} />
                <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-xs text-muted-foreground">{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </ChartWrap>
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
  const [rate, setRate]       = useState("12");
  const [years, setYears]     = useState("10");
  const [result, setResult]   = useState<{ invested: number; returns: number; total: number; cagr: number; growthPct: number; chartData: any[] } | null>(null);

  const calculate = () => {
    const P = parseFloat(monthly), i = parseFloat(rate) / 100 / 12, n = parseFloat(years) * 12;
    if (P > 0 && i > 0 && n > 0) {
      const total    = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
      const invested = P * n;
      const cagr     = (Math.pow(total / invested, 1 / parseFloat(years)) - 1) * 100;
      const chartData = [];
      for (let y = 1; y <= parseFloat(years); y++) {
        const mn  = y * 12;
        const val = P * ((Math.pow(1 + i, mn) - 1) / i) * (1 + i);
        chartData.push({ year: `Y${y}`, Invested: Math.round(P * mn), Returns: Math.round(val - P * mn) });
      }
      setResult({ invested, returns: total - invested, total, cagr, growthPct: ((total - invested) / invested) * 100, chartData });
    }
  };

  return (
    <div className="max-w-5xl mx-auto grid md:grid-cols-[370px_1fr] gap-8">
      <Card className="border-0 shadow-lg shadow-black/5 bg-card/50 backdrop-blur-sm h-fit">
        <CardHeader><CardTitle>SIP Calculator</CardTitle><CardDescription>Estimate your mutual fund SIP returns</CardDescription></CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2"><Label>Monthly Investment (₹)</Label><Input type="number" value={monthly} onChange={e => setMonthly(e.target.value)} className="bg-background" /></div>
          <div className="space-y-2"><Label>Expected Return Rate (% p.a.)</Label><Input type="number" value={rate} onChange={e => setRate(e.target.value)} className="bg-background" /></div>
          <div className="space-y-2"><Label>Investment Duration (Years)</Label><Input type="number" value={years} onChange={e => setYears(e.target.value)} className="bg-background" /></div>
          <Button onClick={calculate} className="w-full h-11 font-semibold rounded-xl">Calculate Returns</Button>
        </CardContent>
      </Card>

      {result ? (
        <ResultPanel>
          <Hero label="Final Maturity Value" value={fmtI(result.total)} sub={`after ${years} years`} />
          <Section title="Investment Summary">
            <Row label="Total Invested"    value={fmtI(result.invested)} />
            <Row label="Estimated Returns" value={fmtI(result.returns)} accent />
            <Row label="Wealth Gain"       value={fmtI(result.returns)} />
            <SplitBar leftLabel="Invested" leftPct={(result.invested / result.total) * 100} rightLabel="Returns" />
          </Section>
          <Section title="Growth Metrics">
            <Row label="CAGR"             value={`${result.cagr.toFixed(2)}%`} accent />
            <Row label="Investment Growth" value={`${result.growthPct.toFixed(1)}%`} />
          </Section>
          <ChartWrap title="Yearly Growth Breakdown">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={result.chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="sipInv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={C.blue}  stopOpacity={0.25} />
                    <stop offset="95%" stopColor={C.blue}  stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="sipRet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={C.green} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={C.green} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={48} />
                <Tooltip content={<LineTooltip />} />
                <Area type="monotone" dataKey="Invested" stackId="1" stroke={C.blue}  fill="url(#sipInv)" strokeWidth={2} />
                <Area type="monotone" dataKey="Returns"  stackId="1" stroke={C.green} fill="url(#sipRet)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartWrap>
        </ResultPanel>
      ) : (
        <EmptyPanel text="Enter your SIP details to see projected wealth and growth breakdown." />
      )}
    </div>
  );
}

/* ─── Compound Interest Calculator ─── */
export function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState("100000");
  const [rate, setRate]           = useState("8");
  const [years, setYears]         = useState("5");
  const [freq, setFreq]           = useState("4");
  const [result, setResult]       = useState<{ amount: number; interest: number; ear: number; growthPct: number; doubling: number; chartData: any[] } | null>(null);

  const calculate = () => {
    const P = parseFloat(principal), r = parseFloat(rate) / 100, t = parseFloat(years), n = parseFloat(freq);
    if (P > 0 && r > 0 && t > 0) {
      const amount   = P * Math.pow(1 + r / n, n * t);
      const ear      = (Math.pow(1 + r / n, n) - 1) * 100;
      const chartData = [];
      for (let y = 1; y <= Math.min(t, 10); y++) {
        const val = P * Math.pow(1 + r / n, n * y);
        chartData.push({ year: `Y${y}`, Principal: Math.round(P), Interest: Math.round(val - P) });
      }
      setResult({ amount, interest: amount - P, ear, growthPct: ((amount - P) / P) * 100, doubling: Math.log(2) / Math.log(1 + r / n) / n, chartData });
    }
  };

  const freqLabel: Record<string, string> = { "1": "Annually", "2": "Semi-Annually", "4": "Quarterly", "12": "Monthly" };

  return (
    <div className="max-w-5xl mx-auto grid md:grid-cols-[370px_1fr] gap-8">
      <Card className="border-0 shadow-lg shadow-black/5 bg-card/50 backdrop-blur-sm h-fit">
        <CardHeader><CardTitle>Compound Interest Calculator</CardTitle><CardDescription>See how your money grows with compounding</CardDescription></CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2"><Label>Principal Amount (₹)</Label><Input type="number" value={principal} onChange={e => setPrincipal(e.target.value)} className="bg-background" /></div>
          <div className="space-y-2"><Label>Interest Rate (% p.a.)</Label><Input type="number" value={rate} onChange={e => setRate(e.target.value)} className="bg-background" /></div>
          <div className="space-y-2"><Label>Time Period (Years)</Label><Input type="number" value={years} onChange={e => setYears(e.target.value)} className="bg-background" /></div>
          <div className="space-y-2">
            <Label>Compounding Frequency</Label>
            <Select value={freq} onValueChange={setFreq}>
              <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Annually</SelectItem><SelectItem value="2">Semi-Annually</SelectItem>
                <SelectItem value="4">Quarterly</SelectItem><SelectItem value="12">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={calculate} className="w-full h-11 font-semibold rounded-xl">Calculate Growth</Button>
        </CardContent>
      </Card>

      {result ? (
        <ResultPanel>
          <Hero label="Final Value" value={fmtI(result.amount)} sub={`${freqLabel[freq]} compounding`} />
          <Section title="Interest Summary">
            <Row label="Principal Amount"    value={fmtI(parseFloat(principal))} />
            <Row label="Total Interest"      value={fmtI(result.interest)} accent />
            <SplitBar leftLabel="Principal"  leftPct={(parseFloat(principal) / result.amount) * 100} rightLabel="Interest" />
          </Section>
          <Section title="Growth Metrics">
            <Row label="Effective Annual Rate (EAR)" value={`${result.ear.toFixed(3)}%`} accent />
            <Row label="Overall Growth"              value={`${result.growthPct.toFixed(2)}%`} />
            <Row label="Doubling Time"               value={`${result.doubling.toFixed(1)} years`} />
          </Section>
          <ChartWrap title="Growth Chart (Principal + Interest)">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={result.chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="ciP" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={C.blue}  stopOpacity={0.3} />
                    <stop offset="95%" stopColor={C.blue}  stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="ciI" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={C.amber} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={C.amber} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={48} />
                <Tooltip content={<LineTooltip />} />
                <Area type="monotone" dataKey="Principal" stackId="1" stroke={C.blue}  fill="url(#ciP)" strokeWidth={2} />
                <Area type="monotone" dataKey="Interest"  stackId="1" stroke={C.amber} fill="url(#ciI)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartWrap>
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
  const [rate, setRate]     = useState("18");
  const [mode, setMode]     = useState<"add"|"remove">("add");
  const [result, setResult] = useState<{ base: number; gst: number; total: number; cgst: number; sgst: number; taxImpact: number } | null>(null);

  const calculate = () => {
    const a = parseFloat(amount), r = parseFloat(rate);
    if (a > 0 && r >= 0) {
      let base: number, gst: number, total: number;
      if (mode === "add") { base = a; gst = a * (r / 100); total = a + gst; }
      else { base = a / (1 + r / 100); gst = a - base; total = a; }
      setResult({ base, gst, total, cgst: gst / 2, sgst: gst / 2, taxImpact: (gst / total) * 100 });
    }
  };

  const pieData = result
    ? [{ name: "Base Amount", value: Math.round(result.base) }, { name: "CGST", value: Math.round(result.cgst) }, { name: "SGST", value: Math.round(result.sgst) }]
    : [];
  const COLORS = [C.blue, C.amber, C.green];

  return (
    <div className="max-w-5xl mx-auto grid md:grid-cols-[370px_1fr] gap-8">
      <Card className="border-0 shadow-lg shadow-black/5 bg-card/50 backdrop-blur-sm h-fit">
        <CardHeader><CardTitle>GST Calculator</CardTitle><CardDescription>Add or remove Goods &amp; Services Tax</CardDescription></CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2"><Label>Amount (₹)</Label><Input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="bg-background" /></div>
          <div className="space-y-2">
            <Label>GST Rate (%)</Label>
            <Select value={rate} onValueChange={setRate}>
              <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="0.25">0.25%</SelectItem><SelectItem value="3">3%</SelectItem>
                <SelectItem value="5">5%</SelectItem><SelectItem value="12">12%</SelectItem>
                <SelectItem value="18">18%</SelectItem><SelectItem value="28">28%</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <RadioGroup value={mode} onValueChange={(v: "add"|"remove") => setMode(v)} className="flex gap-6 py-1">
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
            <Row label="Base Amount (Pre-Tax)"   value={`₹${fmt(result.base)}`} />
            <Row label="GST Amount"              value={`₹${fmt(result.gst)}`} accent />
            <Row label="Final Amount (Inc. GST)" value={`₹${fmt(result.total)}`} />
          </Section>
          <Section title="GST Breakdown (Intra-State)">
            <Row label={`CGST (${parseFloat(rate) / 2}%)`} value={`₹${fmt(result.cgst)}`} />
            <Row label={`SGST (${parseFloat(rate) / 2}%)`} value={`₹${fmt(result.sgst)}`} />
            <Row label={`IGST (${rate}% — Inter-State)`}   value={`₹${fmt(result.gst)}`} accent />
            <Row label="Tax as % of Final Amount"          value={`${result.taxImpact.toFixed(2)}%`} />
          </Section>
          <ChartWrap title="Tax Distribution (Donut)">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={72} paddingAngle={3} dataKey="value" stroke="none">
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip content={<DonutTooltip />} />
                <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-xs text-muted-foreground">{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </ChartWrap>
        </ResultPanel>
      ) : (
        <EmptyPanel text="Enter an amount and GST rate to see the complete tax breakdown." />
      )}
    </div>
  );
}

/* ─── Income Tax Calculator ─── */
export function IncomeTaxCalculator() {
  const [income, setIncome]     = useState("1000000");
  const [taxPct, setTaxPct]     = useState("20");
  const [std, setStd]           = useState("50000");
  const [ded80c, setDed80c]     = useState("150000");
  const [result, setResult]     = useState<{ gross: number; stdDed: number; sec80C: number; taxable: number; tax: number; net: number; effectiveRate: number; monthlyNet: number; monthlyTax: number } | null>(null);

  const calculate = () => {
    const gross = parseFloat(income), taxP = parseFloat(taxPct);
    const stdDed = Math.min(parseFloat(std) || 0, gross);
    const sec80C = Math.min(parseFloat(ded80c) || 0, 150000);
    if (gross > 0 && taxP >= 0) {
      const taxable = Math.max(gross - stdDed - sec80C, 0);
      const tax     = taxable * (taxP / 100);
      const net     = gross - tax;
      setResult({ gross, stdDed, sec80C, taxable, tax, net, effectiveRate: (tax / gross) * 100, monthlyNet: net / 12, monthlyTax: tax / 12 });
    }
  };

  const pieData = result
    ? [{ name: "Net Income", value: Math.round(result.net) }, { name: "Total Tax", value: Math.round(result.tax) }]
    : [];

  return (
    <div className="max-w-5xl mx-auto grid md:grid-cols-[370px_1fr] gap-8">
      <Card className="border-0 shadow-lg shadow-black/5 bg-card/50 backdrop-blur-sm h-fit">
        <CardHeader><CardTitle>Income Tax Calculator</CardTitle><CardDescription>Estimate your tax liability and take-home pay</CardDescription></CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2"><Label>Annual Gross Income (₹)</Label><Input type="number" value={income} onChange={e => setIncome(e.target.value)} className="bg-background" /></div>
          <div className="space-y-2"><Label>Tax Rate (%)</Label><Input type="number" value={taxPct} onChange={e => setTaxPct(e.target.value)} className="bg-background" /></div>
          <div className="space-y-2"><Label>Standard Deduction (₹)</Label><Input type="number" value={std} onChange={e => setStd(e.target.value)} className="bg-background" /></div>
          <div className="space-y-2"><Label>80C Deductions (₹, max ₹1,50,000)</Label><Input type="number" value={ded80c} onChange={e => setDed80c(e.target.value)} className="bg-background" /></div>
          <Button onClick={calculate} className="w-full h-11 font-semibold rounded-xl">Calculate Tax</Button>
        </CardContent>
      </Card>

      {result ? (
        <ResultPanel>
          <Hero label="Net Income After Tax" value={fmtI(result.net)} sub={`Monthly take-home: ${fmtI(result.monthlyNet)}`} />
          <Section title="Tax Summary">
            <Row label="Gross Annual Income" value={fmtI(result.gross)} />
            <Row label="Standard Deduction"  value={`– ${fmtI(result.stdDed)}`} />
            <Row label="80C Deductions"       value={`– ${fmtI(result.sec80C)}`} />
            <Row label="Taxable Income"       value={fmtI(result.taxable)} accent />
          </Section>
          <Section title="Tax Breakdown">
            <Row label="Total Tax Payable"     value={fmtI(result.tax)} accent />
            <Row label="Monthly TDS"           value={fmtI(result.monthlyTax)} />
            <Row label="Effective Tax Rate"    value={`${result.effectiveRate.toFixed(2)}%`} />
            <SplitBar leftLabel="Take-Home" leftPct={(result.net / result.gross) * 100} rightLabel="Tax" leftColor={C.green} rightColor="#fca5a5" />
          </Section>
          <Section title="Monthly Breakdown">
            <Row label="Monthly Gross"     value={fmtI(result.gross / 12)} />
            <Row label="Monthly Tax (TDS)" value={fmtI(result.monthlyTax)} />
            <Row label="Monthly Net"       value={fmtI(result.monthlyNet)} accent />
          </Section>
          <ChartWrap title="Income vs Tax (Donut)">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={72} paddingAngle={3} dataKey="value" stroke="none">
                  <Cell fill={C.green} /><Cell fill={C.red} />
                </Pie>
                <Tooltip content={<DonutTooltip />} />
                <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-xs text-muted-foreground">{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </ChartWrap>
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
  const [rate, setRate]           = useState("7.5");
  const [years, setYears]         = useState("5");
  const [freq, setFreq]           = useState("4");
  const [result, setResult]       = useState<{ maturity: number; interest: number; ear: number; growthPct: number; chartData: any[] } | null>(null);

  const calculate = () => {
    const P = parseFloat(principal), r = parseFloat(rate) / 100, t = parseFloat(years), n = parseFloat(freq);
    if (P > 0 && r > 0 && t > 0 && n > 0) {
      const maturity  = P * Math.pow(1 + r / n, n * t);
      const ear       = (Math.pow(1 + r / n, n) - 1) * 100;
      const chartData = [];
      for (let y = 1; y <= Math.min(t, 10); y++) {
        const val = P * Math.pow(1 + r / n, n * y);
        chartData.push({ year: `Y${y}`, Principal: Math.round(P), Interest: Math.round(val - P) });
      }
      setResult({ maturity, interest: maturity - P, ear, growthPct: ((maturity - P) / P) * 100, chartData });
    }
  };

  const freqLabel: Record<string, string> = { "1": "Annually", "2": "Semi-Annually", "4": "Quarterly", "12": "Monthly" };

  return (
    <div className="max-w-5xl mx-auto grid md:grid-cols-[370px_1fr] gap-8">
      <Card className="border-0 shadow-lg shadow-black/5 bg-card/50 backdrop-blur-sm h-fit">
        <CardHeader><CardTitle>FD Calculator</CardTitle><CardDescription>Calculate Fixed Deposit maturity and returns</CardDescription></CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2"><Label>Principal Amount (₹)</Label><Input type="number" value={principal} onChange={e => setPrincipal(e.target.value)} className="bg-background" /></div>
          <div className="space-y-2"><Label>Annual Interest Rate (%)</Label><Input type="number" value={rate} onChange={e => setRate(e.target.value)} className="bg-background" /></div>
          <div className="space-y-2"><Label>Time Period (Years)</Label><Input type="number" value={years} onChange={e => setYears(e.target.value)} className="bg-background" /></div>
          <div className="space-y-2">
            <Label>Compounding Frequency</Label>
            <Select value={freq} onValueChange={setFreq}>
              <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Annually</SelectItem><SelectItem value="2">Semi-Annually</SelectItem>
                <SelectItem value="4">Quarterly</SelectItem><SelectItem value="12">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={calculate} className="w-full h-11 font-semibold rounded-xl">Calculate Maturity</Button>
        </CardContent>
      </Card>

      {result ? (
        <ResultPanel>
          <Hero label="Maturity Value" value={fmtI(result.maturity)} sub={`${freqLabel[freq]} compounding · ${years} years`} />
          <Section title="FD Summary">
            <Row label="Principal Deposited"     value={fmtI(parseFloat(principal))} />
            <Row label="Interest Earned"         value={fmtI(result.interest)} accent />
            <Row label="Maturity Value"          value={fmtI(result.maturity)} />
            <SplitBar leftLabel="Principal" leftPct={(parseFloat(principal) / result.maturity) * 100} rightLabel="Interest" />
          </Section>
          <Section title="Growth Metrics">
            <Row label="Nominal Rate (p.a.)"          value={`${rate}%`} />
            <Row label="Effective Annual Yield (EAR)" value={`${result.ear.toFixed(3)}%`} accent />
            <Row label="Overall Growth"               value={`${result.growthPct.toFixed(2)}%`} />
          </Section>
          <ChartWrap title="FD Growth Chart (Year by Year)">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={result.chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="fdP" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={C.blue}  stopOpacity={0.3} />
                    <stop offset="95%" stopColor={C.blue}  stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="fdI" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={C.green} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={C.green} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={48} />
                <Tooltip content={<LineTooltip />} />
                <Area type="monotone" dataKey="Principal" stackId="1" stroke={C.blue}  fill="url(#fdP)" strokeWidth={2} />
                <Area type="monotone" dataKey="Interest"  stackId="1" stroke={C.green} fill="url(#fdI)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartWrap>
        </ResultPanel>
      ) : (
        <EmptyPanel text="Enter your FD details to see the maturity breakdown and growth chart." />
      )}
    </div>
  );
}

/* ─── RD Calculator ─── */
export function RdCalculator() {
  const [monthly, setMonthly] = useState("5000");
  const [rate, setRate]       = useState("7");
  const [years, setYears]     = useState("5");
  const [result, setResult]   = useState<{ maturity: number; invested: number; interest: number; effectiveRate: number; growthPct: number; chartData: any[] } | null>(null);

  const calculate = () => {
    const P = parseFloat(monthly), r = parseFloat(rate) / 100 / 4, t = parseFloat(years);
    const n = t * 12;
    if (P > 0 && r > 0 && n > 0) {
      let maturity = 0;
      for (let i = 1; i <= n; i++) maturity += P * Math.pow(1 + r, Math.ceil(i / 3));
      const invested      = P * n;
      const effectiveRate = (Math.pow(maturity / invested, 1 / t) - 1) * 100;
      const chartData: any[] = [];
      for (let y = 1; y <= Math.min(t, 10); y++) {
        const mn = y * 12;
        let val  = 0;
        for (let i = 1; i <= mn; i++) val += P * Math.pow(1 + r, Math.ceil(i / 3));
        chartData.push({ year: `Y${y}`, Invested: Math.round(P * mn), Returns: Math.round(val - P * mn) });
      }
      setResult({ maturity, invested, interest: maturity - invested, effectiveRate, growthPct: ((maturity - invested) / invested) * 100, chartData });
    }
  };

  return (
    <div className="max-w-5xl mx-auto grid md:grid-cols-[370px_1fr] gap-8">
      <Card className="border-0 shadow-lg shadow-black/5 bg-card/50 backdrop-blur-sm h-fit">
        <CardHeader><CardTitle>RD Calculator</CardTitle><CardDescription>Calculate Recurring Deposit maturity value</CardDescription></CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2"><Label>Monthly Deposit (₹)</Label><Input type="number" value={monthly} onChange={e => setMonthly(e.target.value)} className="bg-background" /></div>
          <div className="space-y-2"><Label>Annual Interest Rate (%)</Label><Input type="number" value={rate} onChange={e => setRate(e.target.value)} className="bg-background" /></div>
          <div className="space-y-2"><Label>Time Period (Years)</Label><Input type="number" value={years} onChange={e => setYears(e.target.value)} className="bg-background" /></div>
          <Button onClick={calculate} className="w-full h-11 font-semibold rounded-xl">Calculate Maturity</Button>
        </CardContent>
      </Card>

      {result ? (
        <ResultPanel>
          <Hero label="Maturity Value" value={fmtI(result.maturity)} sub={`${parseInt(years) * 12} monthly deposits of ${fmtI(parseFloat(monthly))}`} />
          <Section title="Investment Summary">
            <Row label="Total Amount Invested"  value={fmtI(result.invested)} />
            <Row label="Total Interest Earned"  value={fmtI(result.interest)} accent />
            <Row label="Maturity Value"         value={fmtI(result.maturity)} />
            <SplitBar leftLabel="Invested" leftPct={(result.invested / result.maturity) * 100} rightLabel="Returns" />
          </Section>
          <Section title="Return Metrics">
            <Row label="Effective Return Rate (CAGR)" value={`${result.effectiveRate.toFixed(2)}%`} accent />
            <Row label="Investment Growth"            value={`${result.growthPct.toFixed(2)}%`} />
            <Row label="Nominal Rate Applied"         value={`${rate}% p.a.`} />
          </Section>
          <ChartWrap title="RD Growth Chart (Year by Year)">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={result.chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="rdInv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={C.blue}  stopOpacity={0.25} />
                    <stop offset="95%" stopColor={C.blue}  stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="rdRet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={C.green} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={C.green} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} width={48} />
                <Tooltip content={<LineTooltip />} />
                <Area type="monotone" dataKey="Invested" stackId="1" stroke={C.blue}  fill="url(#rdInv)" strokeWidth={2} />
                <Area type="monotone" dataKey="Returns"  stackId="1" stroke={C.green} fill="url(#rdRet)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartWrap>
        </ResultPanel>
      ) : (
        <EmptyPanel text="Enter your RD details to see projected maturity and growth chart." />
      )}
    </div>
  );
}
