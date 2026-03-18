import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const ResultCard = ({ title, value, highlight = false, badge = "" }: { title: string, value: string, highlight?: boolean, badge?: string }) => (
  <div className={`p-4 rounded-xl border relative overflow-hidden ${highlight ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border shadow-sm'}`}>
    <p className={`text-sm font-medium mb-1 ${highlight ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>{title}</p>
    <p className="text-2xl font-display font-bold tracking-tight">{value}</p>
    {badge && (
      <span className="absolute top-4 right-4 text-xs font-semibold px-2 py-1 rounded-md bg-white/20 text-current">
        {badge}
      </span>
    )}
  </div>
);

export function BmiCalculator() {
  const [weight, setWeight] = useState<string>("70");
  const [height, setHeight] = useState<string>("175");
  const [result, setResult] = useState<{ bmi: number, category: string, color: string } | null>(null);

  const calculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    if (w > 0 && h > 0) {
      const bmi = w / (h * h);
      let category = "";
      let color = "";
      if (bmi < 18.5) { category = "Underweight"; color = "text-blue-500"; }
      else if (bmi < 24.9) { category = "Normal weight"; color = "text-emerald-500"; }
      else if (bmi < 29.9) { category = "Overweight"; color = "text-amber-500"; }
      else { category = "Obese"; color = "text-rose-500"; }
      setResult({ bmi, category, color });
    }
  };

  return (
    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
      <Card className="border-0 shadow-lg shadow-black/5 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>BMI Calculator</CardTitle>
          <CardDescription>Find out your Body Mass Index</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Weight (kg)</Label>
            <Input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="bg-background" />
          </div>
          <div className="space-y-2">
            <Label>Height (cm)</Label>
            <Input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="bg-background" />
          </div>
          <Button onClick={calculate} className="w-full h-12 text-lg font-semibold rounded-xl">Calculate BMI</Button>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {result ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
            <div className="p-6 rounded-2xl border bg-card text-center space-y-2 shadow-lg shadow-black/5">
              <p className="text-muted-foreground font-medium">Your BMI</p>
              <p className="text-6xl font-display font-black text-foreground">{result.bmi.toFixed(1)}</p>
              <p className={`text-xl font-bold ${result.color}`}>{result.category}</p>
            </div>
            <div className="grid grid-cols-4 gap-1 text-center text-xs font-medium">
              <div className="bg-blue-100 text-blue-700 py-2 rounded-l-lg">&lt; 18.5</div>
              <div className="bg-emerald-100 text-emerald-700 py-2">18.5 - 24.9</div>
              <div className="bg-amber-100 text-amber-700 py-2">25 - 29.9</div>
              <div className="bg-rose-100 text-rose-700 py-2 rounded-r-lg">&ge; 30</div>
            </div>
          </div>
        ) : (
          <div className="h-full border-2 border-dashed border-border rounded-2xl flex items-center justify-center text-muted-foreground p-8 text-center bg-muted/10">
            Enter your height and weight to calculate your BMI.
          </div>
        )}
      </div>
    </div>
  );
}

export function CalorieCalculator() {
  const [age, setAge] = useState<string>("25");
  const [weight, setWeight] = useState<string>("70");
  const [height, setHeight] = useState<string>("175");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [activity, setActivity] = useState<string>("1.55"); // Moderate
  const [result, setResult] = useState<{ maintain: number } | null>(null);

  const calculate = () => {
    const a = parseFloat(age);
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const act = parseFloat(activity);

    if (a > 0 && w > 0 && h > 0) {
      // Harris-Benedict
      let bmr = 0;
      if (gender === "male") {
        bmr = 88.362 + (13.397 * w) + (4.799 * h) - (5.677 * a);
      } else {
        bmr = 447.593 + (9.247 * w) + (3.098 * h) - (4.330 * a);
      }
      const maintain = bmr * act;
      setResult({ maintain });
    }
  };

  return (
    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
      <Card className="border-0 shadow-lg shadow-black/5 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Daily Calorie Needs</CardTitle>
          <CardDescription>Estimate your maintenance calories</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Age</Label>
              <Input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="bg-background" />
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select value={gender} onValueChange={(v: "male" | "female") => setGender(v)}>
                <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Weight (kg)</Label>
              <Input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="bg-background" />
            </div>
            <div className="space-y-2">
              <Label>Height (cm)</Label>
              <Input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="bg-background" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Activity Level</Label>
            <Select value={activity} onValueChange={setActivity}>
              <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1.2">Sedentary (Little/no exercise)</SelectItem>
                <SelectItem value="1.375">Lightly Active (1-3 days/week)</SelectItem>
                <SelectItem value="1.55">Moderately Active (3-5 days/week)</SelectItem>
                <SelectItem value="1.725">Very Active (6-7 days/week)</SelectItem>
                <SelectItem value="1.9">Extra Active (Very hard exercise)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={calculate} className="w-full h-12 text-lg font-semibold rounded-xl">Calculate Calories</Button>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {result ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
            <ResultCard title="Maintenance Calories" value={`${Math.round(result.maintain)} kcal/day`} highlight badge="Maintain Weight" />
            <ResultCard title="Mild Weight Loss (~0.25kg/wk)" value={`${Math.round(result.maintain - 250)} kcal/day`} />
            <ResultCard title="Weight Loss (~0.5kg/wk)" value={`${Math.round(result.maintain - 500)} kcal/day`} />
            <ResultCard title="Weight Gain (~0.5kg/wk)" value={`${Math.round(result.maintain + 500)} kcal/day`} />
          </div>
        ) : (
          <div className="h-full border-2 border-dashed border-border rounded-2xl flex items-center justify-center text-muted-foreground p-8 text-center bg-muted/10">
            Enter your physical stats to see your calorie breakdown.
          </div>
        )}
      </div>
    </div>
  );
}
