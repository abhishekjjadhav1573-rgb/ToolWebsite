import React from "react";
import { useParams } from "wouter";
import { toolsRegistry } from "@/lib/tool-registry";
import { EmiCalculator, SipCalculator, CompoundInterestCalculator, GstCalculator, IncomeTaxCalculator, FdCalculator, RdCalculator } from "@/tools/FinanceTools";
import { BmiCalculator, CalorieCalculator } from "@/tools/HealthTools";
import { PercentageCalculator, AverageCalculator, ProfitLossCalculator, ScientificCalculator } from "@/tools/MathTools";
import { AgeCalculator, PasswordGenerator, QrCodeGenerator } from "@/tools/UtilityTools";
import { ImageToPdfConverter, ImageFormatConverter } from "@/tools/ConverterTools";
import NotFound from "@/pages/not-found";

const toolComponents: Record<string, React.ComponentType> = {
  "emi": EmiCalculator,
  "sip": SipCalculator,
  "compound-interest": CompoundInterestCalculator,
  "gst": GstCalculator,
  "income-tax": IncomeTaxCalculator,
  "fd": FdCalculator,
  "rd": RdCalculator,
  "bmi": BmiCalculator,
  "calorie": CalorieCalculator,
  "percentage": PercentageCalculator,
  "average": AverageCalculator,
  "profit-loss": ProfitLossCalculator,
  "scientific": ScientificCalculator,
  "age": AgeCalculator,
  "password": PasswordGenerator,
  "qrcode": QrCodeGenerator,
  "image-to-pdf": ImageToPdfConverter,
  "image-converter": ImageFormatConverter,
};

export function ToolView() {
  const { id } = useParams();
  const meta = toolsRegistry.find(t => t.id === id);
  const Component = id ? toolComponents[id] : null;

  if (!meta || !Component) {
    return <NotFound />;
  }

  const Icon = meta.icon;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 border-b pb-6">
        <div className="bg-primary/10 p-3 rounded-2xl">
          <Icon className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">{meta.name}</h1>
          <p className="text-muted-foreground text-lg">{meta.description}</p>
        </div>
      </div>
      
      <div className="py-2">
        <Component />
      </div>
    </div>
  );
}
