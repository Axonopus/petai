import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Clock } from "lucide-react";
import { SubscriptionPricing } from "@/types/subscription";
import { useState } from "react";

interface PlanCardProps {
  plan: SubscriptionPricing;
  isCurrentPlan: boolean;
  onSelectPlan: (
    plan: SubscriptionPricing,
    billingCycle: "monthly" | "annual",
  ) => void;
}

export default function PlanCard({
  plan,
  isCurrentPlan,
  onSelectPlan,
}: PlanCardProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "monthly",
  );

  const handleSelectPlan = () => {
    onSelectPlan(plan, billingCycle);
  };

  return (
    <Card
      className={`flex flex-col h-full ${isCurrentPlan ? "border-[#FC8D68] shadow-md" : ""} ${plan.isPopular ? "shadow-md" : ""}`}
    >
      <CardHeader className="pb-2">
        {isCurrentPlan && (
          <Badge className="w-fit mb-2 bg-[#FC8D68] hover:bg-[#e87e5c]">
            Current Plan
          </Badge>
        )}
        {plan.isPopular && !isCurrentPlan && (
          <Badge className="w-fit mb-2 bg-blue-500 hover:bg-blue-600">
            Popular
          </Badge>
        )}
        {plan.isComingSoon && (
          <Badge className="w-fit mb-2 bg-gray-500 hover:bg-gray-600">
            <Clock className="mr-1 h-3 w-3" />
            Coming Soon
          </Badge>
        )}
        <CardTitle>{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="mb-4">
          {billingCycle === "monthly" ? (
            <div className="flex items-baseline">
              <span className="text-3xl font-bold">${plan.monthlyPrice}</span>
              <span className="text-gray-500 ml-1">/month</span>
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">
                  ${plan.annualPrice / 12}
                </span>
                <span className="text-gray-500 ml-1">/month</span>
              </div>
              <div className="text-sm text-green-600 font-medium">
                ${plan.annualPrice} billed annually (20% savings)
              </div>
            </div>
          )}
        </div>

        {!plan.isFree && !plan.isComingSoon && (
          <div className="flex border rounded-md overflow-hidden mb-6">
            <button
              className={`flex-1 text-sm py-2 ${billingCycle === "monthly" ? "bg-[#FC8D68] text-white" : "bg-gray-100"}`}
              onClick={() => setBillingCycle("monthly")}
            >
              Monthly
            </button>
            <button
              className={`flex-1 text-sm py-2 ${billingCycle === "annual" ? "bg-[#FC8D68] text-white" : "bg-gray-100"}`}
              onClick={() => setBillingCycle("annual")}
            >
              Annual
            </button>
          </div>
        )}

        <ul className="space-y-2">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        {plan.isComingSoon ? (
          <Button className="w-full" disabled>
            Coming Soon
          </Button>
        ) : isCurrentPlan ? (
          <Button className="w-full" variant="outline" disabled>
            Current Plan
          </Button>
        ) : (
          <Button
            className="w-full bg-[#FC8D68] hover:bg-[#e87e5c]"
            onClick={handleSelectPlan}
          >
            {plan.isFree ? "Current Plan" : `Get ${plan.name}`}
            {plan.trialDays && !plan.isFree && ` - ${plan.trialDays} Day Trial`}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
