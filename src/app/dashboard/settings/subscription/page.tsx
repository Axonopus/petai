import SubscriptionSettings from "../subscription-settings";

export default function SubscriptionPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Subscription & Billing</h1>
      </div>
      <SubscriptionSettings />
    </div>
  );
}
