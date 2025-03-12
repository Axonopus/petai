import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2 order-2 md:order-1">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Streamline Your Pet Business
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              The ultimate management platform for pet care businesses. Simplify
              operations, enhance client engagement, and grow your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center px-6 py-3 text-white bg-[#FC8D68] rounded-lg hover:bg-[#e87e5c] transition-colors text-lg font-medium"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>

              <Link
                href="#pricing"
                className="inline-flex items-center justify-center px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-lg font-medium"
              >
                View Pricing
              </Link>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center sm:items-start justify-start gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 order-1 md:order-2">
            <div className="relative rounded-xl overflow-hidden shadow-xl">
              <img
                src="/hero-image.png"
                alt="Pet business owner using GoPet AI platform with a dog"
                className="w-full h-auto object-cover rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
