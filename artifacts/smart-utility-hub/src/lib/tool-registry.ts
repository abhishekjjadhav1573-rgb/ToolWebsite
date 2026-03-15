import { 
  Calculator, PieChart, TrendingUp, IndianRupee, Landmark,
  Scale, Activity,
  Percent, Hash,
  CalendarDays, KeyRound, QrCode
} from "lucide-react";

export interface ToolMetadata {
  id: string;
  name: string;
  category: "Finance" | "Health" | "Math" | "Utility";
  description: string;
  icon: React.ElementType;
}

export const toolsRegistry: ToolMetadata[] = [
  // Finance
  { id: "emi", name: "EMI Calculator", category: "Finance", description: "Calculate your monthly EMI and total interest", icon: Landmark },
  { id: "sip", name: "SIP Calculator", category: "Finance", description: "Estimate returns on your mutual fund investments", icon: TrendingUp },
  { id: "compound-interest", name: "Compound Interest", category: "Finance", description: "Calculate compound interest over time", icon: PieChart },
  { id: "gst", name: "GST Calculator", category: "Finance", description: "Add or remove GST from an amount", icon: Calculator },
  { id: "income-tax", name: "Income Tax Calculator", category: "Finance", description: "Estimate your income tax and take-home pay", icon: IndianRupee },
  
  // Health
  { id: "bmi", name: "BMI Calculator", category: "Health", description: "Check your Body Mass Index and weight category", icon: Scale },
  { id: "calorie", name: "Calorie Calculator", category: "Health", description: "Estimate your daily calorie needs", icon: Activity },
  
  // Math
  { id: "percentage", name: "Percentage Calculator", category: "Math", description: "Calculate percentages and percentage changes", icon: Percent },
  { id: "average", name: "Average Calculator", category: "Math", description: "Find the average, min, and max of numbers", icon: Hash },
  
  // Utility
  { id: "age", name: "Age Calculator", category: "Utility", description: "Calculate your exact age and next birthday", icon: CalendarDays },
  { id: "password", name: "Password Generator", category: "Utility", description: "Generate strong, secure passwords", icon: KeyRound },
  { id: "qrcode", name: "QR Code Generator", category: "Utility", description: "Create scannable QR codes for links and text", icon: QrCode },
];
