import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Calendar, CreditCard, AlertTriangle } from "lucide-react";
import { Subscription } from "@/types/subscription";

interface CurrentSubscriptionProps {
  subscription: Subscription;
  onCancelSubscription: () => Promise<void>;
  loading: boolean;
}

export default function CurrentSubscription({
  subscription,
  onCancelSubscription,
  loading,
}: CurrentSubscriptionProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Active
          </Badge>
        );
      case "trialing":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Trial
          </Badge>
        );
      case "canceled":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Canceled
          </Badge>
        );
      case "past_due":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            Past Due
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            Free
          </Badge>
        );
    }
  };

  const getPlanName = (plan: string) => {
    switch (plan) {
      case "petshop_pos":
        return "Pet Shop with POS";
      case "boarding":
        return "Boarding";
      case "daycare":
        return "Daycare";
      case "grooming":
        return "Grooming";
      default:
        return "Free Plan";
    }
  };

  const isFree =
    subscription.subscription_status === "free" ||
    subscription.current_plan === "free";
  const isCanceled = subscription.subscription_status === "canceled";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Subscription</CardTitle>
        <CardDescription>
          Manage your subscription plan and billing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-medium">
                  {getPlanName(subscription.current_plan)}
                </h3>
                {getStatusBadge(subscription.subscription_status)}
              </div>
              {!isFree && (
                <p className="text-sm text-gray-500">
                  {subscription.billing_cycle === "annual"
                    ? "Annual"
                    : "Monthly"}{" "}
                  billing
                  {subscription.amount &&
                    ` - $${subscription.amount}/${subscription.billing_cycle === "annual" ? "year" : "month"}`}
                </p>
              )}
            </div>
            {!isFree && !isCanceled && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                    disabled={loading}
                  >
                    Cancel Subscription
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to cancel your subscription? You'll
                      continue to have access until the end of your current
                      billing period.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-600 hover:bg-red-700"
                      onClick={onCancelSubscription}
                    >
                      Yes, Cancel
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>

          {!isFree && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              {subscription.next_billing_date && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Next Billing Date</p>
                    <p className="text-sm text-gray-500">
                      {formatDate(subscription.next_billing_date)}
                    </p>
                  </div>
                </div>
              )}
              {subscription.trial_end_date && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Trial Ends</p>
                    <p className="text-sm text-gray-500">
                      {formatDate(subscription.trial_end_date)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {subscription.subscription_status === "past_due" && (
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-md flex items-start gap-2 mt-4">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <p className="font-medium text-amber-800">
                  Payment Issue Detected
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  We couldn't process your last payment. Please update your
                  payment method to avoid service interruption.
                </p>
                <Button className="mt-2 bg-amber-600 hover:bg-amber-700">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Update Payment Method
                </Button>
              </div>
            </div>
          )}

          {isCanceled && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-md flex items-start gap-2 mt-4">
              <div>
                <p className="font-medium">Subscription Canceled</p>
                <p className="text-sm text-gray-500 mt-1">
                  Your subscription has been canceled. You can resubscribe at
                  any time to regain access to premium features.
                </p>
                {subscription.next_billing_date && (
                  <p className="text-sm text-gray-500 mt-1">
                    You'll have access to premium features until{" "}
                    {formatDate(subscription.next_billing_date)}.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
