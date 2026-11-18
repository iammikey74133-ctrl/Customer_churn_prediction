import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { RiskBadge } from "@/components/RiskBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { computeChurnProbability, getRiskLevel, getTopDrivers, type Customer } from "@/data/mockData";
import { UserCheck, AlertTriangle, CheckCircle } from "lucide-react";

export default function IndividualScoring() {
  const [result, setResult] = useState<{ prob: number; risk: Customer["Risk_Level"]; drivers: string[]; action: string } | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      Customer_ID: "MANUAL-001",
      Age: Number(fd.get("age")) || 30,
      Gender: (fd.get("gender") as Customer["Gender"]) || "Male",
      Region: (fd.get("region") as Customer["Region"]) || "Rural",
      Occupation_Type: (fd.get("occupation") as Customer["Occupation_Type"]) || "Agriculture",
      Loan_Amount: Number(fd.get("loanAmount")) || 20000,
      Interest_Rate: Number(fd.get("interestRate")) || 14,
      Loan_Tenure_Months: Number(fd.get("tenure")) || 12,
      Loan_Cycle_Number: Number(fd.get("loanCycle")) || 1,
      Total_Loans_Taken: Number(fd.get("totalLoans")) || 1,
      Avg_Days_Past_Due: Number(fd.get("avgDPD")) || 0,
      Missed_Payments: Number(fd.get("missedPayments")) || 0,
      Repayment_Consistency_Ratio: Number(fd.get("repaymentRatio")) || 0.9,
      Savings_Account_Balance: Number(fd.get("savingsBalance")) || 5000,
      Months_Since_Last_Loan: Number(fd.get("monthsSinceLast")) || 1,
      Field_Officer_Visits_Last_3M: Number(fd.get("fieldVisits")) || 3,
      SMS_Response_Rate: Number(fd.get("smsRate")) || 0.7,
      Previous_Default: (fd.get("previousDefault") as "Yes" | "No") || "No",
    };
    const prob = computeChurnProbability(data);
    const risk = getRiskLevel(prob);
    const customer = { ...data, Churn_Label: (prob > 0.5 ? 1 : 0) as 0 | 1, Churn_Probability: prob, Risk_Level: risk } as Customer;
    const drivers = getTopDrivers(customer);
    const action = risk === "High" ? "Immediate field visit & restructure repayment plan" : risk === "Medium" ? "Schedule phone follow-up & SMS campaign" : "Cross-sell new loan product";
    setResult({ prob, risk, drivers, action });
  };

  const fields = [
    { name: "age", label: "Age", type: "number", defaultValue: "35" },
    { name: "loanAmount", label: "Loan Amount (₹)", type: "number", defaultValue: "25000" },
    { name: "interestRate", label: "Interest Rate (%)", type: "number", defaultValue: "14" },
    { name: "tenure", label: "Tenure (Months)", type: "number", defaultValue: "12" },
    { name: "loanCycle", label: "Loan Cycle #", type: "number", defaultValue: "2" },
    { name: "totalLoans", label: "Total Loans Taken", type: "number", defaultValue: "3" },
    { name: "avgDPD", label: "Avg Days Past Due", type: "number", defaultValue: "5" },
    { name: "missedPayments", label: "Missed Payments", type: "number", defaultValue: "1" },
    { name: "repaymentRatio", label: "Repayment Ratio (0-1)", type: "number", defaultValue: "0.85", step: "0.01" },
    { name: "savingsBalance", label: "Savings Balance (₹)", type: "number", defaultValue: "8000" },
    { name: "monthsSinceLast", label: "Months Since Last Loan", type: "number", defaultValue: "2" },
    { name: "fieldVisits", label: "Field Visits (3M)", type: "number", defaultValue: "3" },
    { name: "smsRate", label: "SMS Response Rate (0-1)", type: "number", defaultValue: "0.6", step: "0.01" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Individual Scoring</h1>
          <p className="text-sm text-muted-foreground">Score a single borrower for churn risk</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 animate-fade-in">
            <CardHeader><CardTitle className="text-sm">Borrower Details</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select name="gender" defaultValue="Male">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="region">Region</Label>
                    <Select name="region" defaultValue="Rural">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Urban">Urban</SelectItem>
                        <SelectItem value="Rural">Rural</SelectItem>
                        <SelectItem value="Semi-Urban">Semi-Urban</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="occupation">Occupation</Label>
                    <Select name="occupation" defaultValue="Agriculture">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Agriculture">Agriculture</SelectItem>
                        <SelectItem value="Small_Business">Small Business</SelectItem>
                        <SelectItem value="Salaried">Salaried</SelectItem>
                        <SelectItem value="Daily_Wage">Daily Wage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="previousDefault">Previous Default</Label>
                    <Select name="previousDefault" defaultValue="No">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {fields.map((f) => (
                    <div key={f.name}>
                      <Label htmlFor={f.name}>{f.label}</Label>
                      <Input name={f.name} type={f.type} defaultValue={f.defaultValue} step={f.step} />
                    </div>
                  ))}
                </div>
                <Button type="submit" className="w-full gradient-primary text-primary-foreground">
                  <UserCheck className="h-4 w-4 mr-2" /> Predict Churn Risk
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Result */}
          <div className="space-y-4">
            {result ? (
              <>
                <Card className="animate-fade-in">
                  <CardHeader><CardTitle className="text-sm">Prediction Result</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold font-mono">{(result.prob * 100).toFixed(1)}%</div>
                      <p className="text-sm text-muted-foreground mt-1">Churn Probability</p>
                      <div className="mt-2"><RiskBadge level={result.risk} /></div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="animate-fade-in">
                  <CardHeader><CardTitle className="text-sm flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Top Risk Drivers</CardTitle></CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.drivers.map((d, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <span className="h-5 w-5 rounded-full bg-danger/15 text-danger text-xs flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                          {d}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                <Card className="animate-fade-in border-primary/30">
                  <CardHeader><CardTitle className="text-sm flex items-center gap-2"><CheckCircle className="h-4 w-4 text-primary" /> Recommended Action</CardTitle></CardHeader>
                  <CardContent>
                    <p className="text-sm">{result.action}</p>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="animate-fade-in">
                <CardContent className="py-12 text-center text-muted-foreground">
                  <UserCheck className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Fill in borrower details and click predict to see results</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
