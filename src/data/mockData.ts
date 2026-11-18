// Mock data and types for the Microfinance Churn Prediction system

export interface Customer {
  Customer_ID: string;
  Age: number;
  Gender: "Male" | "Female";
  Region: "Urban" | "Rural" | "Semi-Urban";
  Occupation_Type: "Agriculture" | "Small_Business" | "Salaried" | "Daily_Wage";
  Loan_Amount: number;
  Interest_Rate: number;
  Loan_Tenure_Months: number;
  Loan_Cycle_Number: number;
  Total_Loans_Taken: number;
  Avg_Days_Past_Due: number;
  Missed_Payments: number;
  Repayment_Consistency_Ratio: number;
  Savings_Account_Balance: number;
  Months_Since_Last_Loan: number;
  Field_Officer_Visits_Last_3M: number;
  SMS_Response_Rate: number;
  Previous_Default: "Yes" | "No";
  Churn_Label: 0 | 1;
  Churn_Probability?: number;
  Risk_Level?: "Low" | "Medium" | "High";
  Top_Risk_Drivers?: string[];
}

export type RiskLevel = "Low" | "Medium" | "High";

export function computeChurnProbability(c: Omit<Customer, "Churn_Probability" | "Risk_Level" | "Top_Risk_Drivers" | "Churn_Label">): number {
  let score = 0.15;
  if (c.Avg_Days_Past_Due > 20) score += 0.18;
  else if (c.Avg_Days_Past_Due > 10) score += 0.08;
  if (c.Missed_Payments > 3) score += 0.15;
  else if (c.Missed_Payments > 1) score += 0.06;
  if (c.Repayment_Consistency_Ratio < 0.6) score += 0.15;
  else if (c.Repayment_Consistency_Ratio < 0.8) score += 0.05;
  if (c.Loan_Cycle_Number === 1) score += 0.08;
  if (c.Months_Since_Last_Loan > 4) score += 0.1;
  if (c.Savings_Account_Balance < 500) score += 0.06;
  if (c.Previous_Default === "Yes") score += 0.12;
  if (c.SMS_Response_Rate < 0.3) score += 0.06;
  if (c.Field_Officer_Visits_Last_3M < 2) score += 0.05;
  return Math.min(Math.max(score + (Math.random() * 0.1 - 0.05), 0), 1);
}

export function getRiskLevel(prob: number): RiskLevel {
  if (prob <= 0.3) return "Low";
  if (prob <= 0.7) return "Medium";
  return "High";
}

export function getTopDrivers(c: Customer): string[] {
  const drivers: { label: string; weight: number }[] = [];
  if (c.Avg_Days_Past_Due > 20) drivers.push({ label: "High Days Past Due", weight: 0.18 });
  if (c.Missed_Payments > 3) drivers.push({ label: "Frequent Missed Payments", weight: 0.15 });
  if (c.Repayment_Consistency_Ratio < 0.6) drivers.push({ label: "Low Repayment Consistency", weight: 0.15 });
  if (c.Previous_Default === "Yes") drivers.push({ label: "Previous Default History", weight: 0.12 });
  if (c.Months_Since_Last_Loan > 4) drivers.push({ label: "Long Inactivity Period", weight: 0.1 });
  if (c.Loan_Cycle_Number === 1) drivers.push({ label: "First-time Borrower", weight: 0.08 });
  if (c.SMS_Response_Rate < 0.3) drivers.push({ label: "Low SMS Engagement", weight: 0.06 });
  if (c.Savings_Account_Balance < 500) drivers.push({ label: "Low Savings Balance", weight: 0.06 });
  if (c.Field_Officer_Visits_Last_3M < 2) drivers.push({ label: "Insufficient Field Visits", weight: 0.05 });
  drivers.sort((a, b) => b.weight - a.weight);
  return drivers.slice(0, 5).map((d) => d.label);
}

const names = ["MF", "LN", "BW", "CR", "DP", "GH", "KL", "RT", "SV", "TN"];
const regions: Customer["Region"][] = ["Urban", "Rural", "Semi-Urban"];
const occupations: Customer["Occupation_Type"][] = ["Agriculture", "Small_Business", "Salaried", "Daily_Wage"];
const genders: Customer["Gender"][] = ["Male", "Female"];

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randf(min: number, max: number) {
  return +(Math.random() * (max - min) + min).toFixed(2);
}

export function generateMockCustomers(count = 200): Customer[] {
  return Array.from({ length: count }, (_, i) => {
    const base: Omit<Customer, "Churn_Probability" | "Risk_Level" | "Top_Risk_Drivers" | "Churn_Label"> = {
      Customer_ID: `${names[i % names.length]}-${String(1000 + i).padStart(5, "0")}`,
      Age: rand(21, 62),
      Gender: genders[rand(0, 1)],
      Region: regions[rand(0, 2)],
      Occupation_Type: occupations[rand(0, 3)],
      Loan_Amount: rand(5000, 150000),
      Interest_Rate: randf(8, 26),
      Loan_Tenure_Months: [6, 12, 18, 24][rand(0, 3)],
      Loan_Cycle_Number: rand(1, 8),
      Total_Loans_Taken: rand(1, 12),
      Avg_Days_Past_Due: randf(0, 45),
      Missed_Payments: rand(0, 8),
      Repayment_Consistency_Ratio: randf(0.3, 1),
      Savings_Account_Balance: randf(0, 25000),
      Months_Since_Last_Loan: rand(0, 12),
      Field_Officer_Visits_Last_3M: rand(0, 6),
      SMS_Response_Rate: randf(0.1, 1),
      Previous_Default: Math.random() > 0.75 ? "Yes" : "No",
    };
    const prob = computeChurnProbability(base);
    const c: Customer = {
      ...base,
      Churn_Label: prob > 0.5 ? 1 : 0,
      Churn_Probability: +prob.toFixed(3),
      Risk_Level: getRiskLevel(prob),
    };
    c.Top_Risk_Drivers = getTopDrivers(c);
    return c;
  });
}

export const mockCustomers = generateMockCustomers(200);

// Aggregated stats
export function getStats(customers: Customer[]) {
  const total = customers.length;
  const churned = customers.filter((c) => c.Churn_Label === 1).length;
  const highRisk = customers.filter((c) => c.Risk_Level === "High").length;
  const medRisk = customers.filter((c) => c.Risk_Level === "Medium").length;
  const lowRisk = customers.filter((c) => c.Risk_Level === "Low").length;
  const churnRate = total > 0 ? ((churned / total) * 100).toFixed(1) : "0";
  const avgDPD = (customers.reduce((s, c) => s + c.Avg_Days_Past_Due, 0) / total).toFixed(1);

  const byRegion = regions.map((r) => {
    const rc = customers.filter((c) => c.Region === r);
    return { region: r, total: rc.length, churned: rc.filter((c) => c.Churn_Label === 1).length };
  });

  const byLoanCycle = [1, 2, 3, 4, 5].map((cycle) => {
    const cc = customers.filter((c) => c.Loan_Cycle_Number === cycle);
    return { cycle: `Cycle ${cycle}`, total: cc.length, churned: cc.filter((c) => c.Churn_Label === 1).length };
  });

  return { total, churned, highRisk, medRisk, lowRisk, churnRate, avgDPD, byRegion, byLoanCycle };
}

// Feature importance (mock)
export const featureImportance = [
  { feature: "Avg Days Past Due", importance: 0.22 },
  { feature: "Missed Payments", importance: 0.18 },
  { feature: "Repayment Consistency", importance: 0.16 },
  { feature: "Previous Default", importance: 0.12 },
  { feature: "Months Since Last Loan", importance: 0.10 },
  { feature: "Loan Cycle Number", importance: 0.08 },
  { feature: "SMS Response Rate", importance: 0.06 },
  { feature: "Savings Balance", importance: 0.04 },
  { feature: "Field Officer Visits", importance: 0.03 },
  { feature: "Interest Rate", importance: 0.01 },
];

// Confusion matrix (mock model performance)
export const modelPerformance = {
  accuracy: 0.87,
  precision: 0.84,
  recall: 0.82,
  f1: 0.83,
  rocAuc: 0.91,
  confusionMatrix: { tp: 82, fp: 16, fn: 18, tn: 84 },
};
