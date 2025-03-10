"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  link: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
  link,
}: FeatureCardProps) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="text-[#FC8D68] mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <Link
        href={link}
        className="text-[#FC8D68] font-medium hover:underline inline-flex items-center"
      >
        Learn More
        <ArrowRight className="ml-1 w-4 h-4" />
      </Link>
    </div>
  );
}
