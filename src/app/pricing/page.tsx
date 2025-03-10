import ClientNavbar from "@/components/client-navbar";
import PricingCard from "@/components/pricing-card";

export default function Pricing() {
  // Mock plans data since we can't use the Deno edge function
  const plans = [
    {
      id: "price_free",
      name: "Free",
      amount: 0,
      interval: "month",
      popular: false,
    },
    {
      id: "price_standard",
      name: "Standard",
      amount: 4900,
      interval: "month",
      popular: true,
    },
    {
      id: "price_premium",
      name: "Premium",
      amount: 9900,
      interval: "month",
      popular: false,
    },
  ];

  return (
    <>
      <ClientNavbar />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-muted-foreground">
            Choose the perfect plan for your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((item) => (
            <PricingCard key={item.id} item={item} user={null} />
          ))}
        </div>
      </div>
    </>
  );
}
