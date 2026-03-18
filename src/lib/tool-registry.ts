import { 
  Calculator, PieChart, TrendingUp, IndianRupee, Landmark,
  Scale, Activity,
  Percent, Hash, TrendingDown, FlaskConical,
  CalendarDays, KeyRound, QrCode, FileImage, ImageIcon,
  Banknote, Repeat
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
  { id: "fd", name: "FD Calculator", category: "Finance", description: "Calculate Fixed Deposit maturity amount and interest", icon: Banknote },
  { id: "rd", name: "RD Calculator", category: "Finance", description: "Calculate Recurring Deposit maturity value", icon: Repeat },

  // Health
  { id: "bmi", name: "BMI Calculator", category: "Health", description: "Check your Body Mass Index and weight category", icon: Scale },
  { id: "calorie", name: "Calorie Calculator", category: "Health", description: "Estimate your daily calorie needs", icon: Activity },

  // Math
  { id: "percentage", name: "Percentage Calculator", category: "Math", description: "Calculate percentages and percentage changes", icon: Percent },
  { id: "average", name: "Average Calculator", category: "Math", description: "Find the average, min, and max of numbers", icon: Hash },
  { id: "profit-loss", name: "Profit & Loss Calculator", category: "Math", description: "Calculate profit or loss from cost and selling price", icon: TrendingDown },
  { id: "scientific", name: "Scientific Calculator", category: "Math", description: "Advanced calculator with trig, log, and power functions", icon: FlaskConical },

  // Utility
  { id: "age", name: "Age Calculator", category: "Utility", description: "Calculate your exact age and next birthday", icon: CalendarDays },
  { id: "password", name: "Password Generator", category: "Utility", description: "Generate strong, secure passwords", icon: KeyRound },
  { id: "qrcode", name: "QR Code Generator", category: "Utility", description: "Create scannable QR codes for links and text", icon: QrCode },
  { id: "image-to-pdf", name: "Image to PDF", category: "Utility", description: "Convert images into a downloadable PDF file", icon: FileImage },
  { id: "image-converter", name: "Image Format Converter", category: "Utility", description: "Convert images between JPG, PNG, and WEBP formats", icon: ImageIcon },
];
