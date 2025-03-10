"use client";

import Link from "next/link";

interface PricingTierProps {
  title: string;
  description: string;
  price: string;
  period: string;
  features: string[];
  buttonText: string;
  buttonLink: string;
  highlighted?: boolean;
}

export default function PricingTier({
  title,
  description,
  price,
  period,
  features,
  buttonText,
  buttonLink,
  highlighted = false,
}: PricingTierProps) {
  return (
    <div
      className={`${highlighted ? "border-2 border-[#FC8D68] shadow-lg" : "border border-gray-200 shadow-sm"} rounded-xl p-8 bg-white hover:shadow-md transition-all relative overflow-hidden`}
    >
      {highlighted && (
        <div className="absolute top-0 right-0 bg-[#FC8D68] text-white px-4 py-1 text-sm font-medium rounded-bl-lg">
          MOST POPULAR
        </div>
      )}
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      <p className="text-gray-500 mb-4">{description}</p>
      <div className="text-4xl font-bold mb-6">
        {price}
        <span className="text-lg text-gray-500 font-normal">{period}</span>
      </div>

      <ul className="space-y-3 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start">
            <svg
              className="w-5 h-5 text-green-500 mr-2 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Link
        href={buttonLink}
        className={`block text-center py-3 px-6 ${highlighted ? "bg-[#FC8D68] hover:bg-[#e87e5c] text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-800"} rounded-lg font-medium transition-colors w-full`}
      >
        {buttonText}
      </Link>
    </div>
  );
}
