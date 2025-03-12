"use client";

import "./animations.css";
import Footer from "@/components/footer";
import ClientNavbar from "@/components/client-navbar";
import {
  ArrowUpRight,
  Calendar,
  Users,
  CreditCard,
  Globe,
  Star,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import PageLoading from "@/components/page-loading";
import { ScrollAnimations } from "@/components/scroll-animations";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <PageLoading />;
  }

  return (
    <div className="min-h-screen bg-white">
      <ClientNavbar />

      {/* Hero Section - Split Screen */}
      <ScrollAnimations animation="fade-in">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="w-full md:w-1/2 order-2 md:order-1">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight animate-fade-in-up">
                  Streamline Your Pet Business
                </h1>
                <p className="text-lg text-gray-600 mb-8 max-w-lg animate-fade-in-delay">
                  The ultimate management platform for pet care businesses.
                  Simplify operations, enhance client engagement, and grow your
                  business.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-delay-2">
                  <Link
                    href="/business-registration"
                    className="inline-flex items-center justify-center px-6 py-3 text-white bg-[#FC8D68] rounded-lg hover:bg-[#e87e5c] transition-colors text-lg font-medium hover:scale-102"
                  >
                    Get Started
                    <ArrowRight className="ml-2 w-5 h-5 animate-bounce" />
                  </Link>
                  <Link
                    href="#pricing"
                    className="inline-flex items-center justify-center px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-lg font-medium hover:scale-102"
                  >
                    View Pricing
                  </Link>
                </div>
              </div>
              <div className="w-full md:w-1/2 order-1 md:order-2">
                <div className="relative">
                  <div className="absolute -top-4 -right-4 z-10 bg-white rounded-lg shadow-lg p-4 animate-bounce-slow">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <p className="text-sm font-medium">New booking: $500</p>
                    </div>
                  </div>
                  <div className="rounded-xl overflow-hidden shadow-xl hover:scale-102 transition-transform duration-300 relative">
                    <img
                      src="/hero-image.png"
                      alt="Pet business owner using GoPet AI platform"
                      className="w-full h-auto object-cover rounded-xl animate-float"
                    />
                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3 animate-fade-in-up">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <p className="text-sm font-medium">15 active bookings today</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollAnimations>

      {/* Features Grid Section */}
      <ScrollAnimations animation="fade-up" delay={0.2}>
        <section className="py-20 bg-gray-50" id="features">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">
                Powerful Features for Pet Businesses
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Everything you need to manage and grow your pet care business in
                one platform.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Calendar className="w-6 h-6" />,
                  title: "Smart Calendar",
                  description:
                    "Intelligent scheduling system that prevents double-bookings and optimizes your daily operations.",
                  link: "#features",
                },
                {
                  icon: <Users className="w-6 h-6" />,
                  title: "CRM with Loyalty Rewards",
                  description:
                    "Track client information and pet details while rewarding repeat customers with a built-in loyalty program.",
                  link: "#features",
                },
                {
                  icon: <CreditCard className="w-6 h-6" />,
                  title: "POS & Invoicing",
                  description:
                    "Seamless point-of-sale system with automated invoicing and payment tracking for all your services.",
                  link: "#features",
                },
                {
                  icon: <Globe className="w-6 h-6" />,
                  title: "Custom Booking Pages",
                  description:
                    "Personalized online booking pages that match your brand and allow clients to book services 24/7.",
                  link: "#features",
                },
                {
                  icon: <Star className="w-6 h-6" />,
                  title: "Client Reviews",
                  description:
                    "Automated review collection system to build your online reputation and attract new customers.",
                  link: "#features",
                },
                {
                  icon: <ArrowUpRight className="w-6 h-6" />,
                  title: "Business Analytics",
                  description:
                    "Comprehensive reporting tools to track growth, identify trends, and make data-driven decisions.",
                  link: "#features",
                },
              ].map((feature, index) => (
                <ScrollAnimations
                  key={index}
                  animation="fade-up"
                  delay={0.1 * (index + 1)}
                >
                  <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300">
                    <div className="text-[#FC8D68] mb-4 animate-wiggle">{feature.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600 mb-4">{feature.description}</p>
                    <Link
                      href={feature.link}
                      className="text-[#FC8D68] font-medium hover:underline inline-flex items-center group"
                    >
                      Learn More
                      <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </ScrollAnimations>
              ))}
            </div>
          </div>
        </section>
      </ScrollAnimations>

      {/* Pricing Section */}
      <ScrollAnimations animation="fade-up" delay={0.3}>
        <section className="py-24 bg-white" id="pricing">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Choose the Right Plan for Your Business</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Select a plan that best fits your business needs and scale as you grow.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Basic Plan */}
              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-2xl font-bold mb-4">Basic</h3>
                <div className="text-3xl font-bold mb-6">$49<span className="text-lg text-gray-500 font-normal">/mo</span></div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center"><Star className="w-5 h-5 text-[#FC8D68] mr-2" />Calendar Management</li>
                  <li className="flex items-center"><Star className="w-5 h-5 text-[#FC8D68] mr-2" />Basic CRM</li>
                  <li className="flex items-center"><Star className="w-5 h-5 text-[#FC8D68] mr-2" />Online Booking</li>
                </ul>
                <Link href="/business-registration" className="block text-center py-3 px-6 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">Get Started</Link>
              </div>

              {/* Pro Plan */}
              <div className="bg-[#FC8D68] p-8 rounded-xl shadow-md transform scale-105">
                <h3 className="text-2xl font-bold mb-4 text-white">Pro</h3>
                <div className="text-3xl font-bold mb-6 text-white">$99<span className="text-lg text-gray-100 font-normal">/mo</span></div>
                <ul className="space-y-4 mb-8 text-white">
                  <li className="flex items-center"><Star className="w-5 h-5 text-white mr-2" />All Basic Features</li>
                  <li className="flex items-center"><Star className="w-5 h-5 text-white mr-2" />Advanced CRM</li>
                  <li className="flex items-center"><Star className="w-5 h-5 text-white mr-2" />POS System</li>
                  <li className="flex items-center"><Star className="w-5 h-5 text-white mr-2" />Analytics Dashboard</li>
                </ul>
                <Link href="/business-registration" className="block text-center py-3 px-6 bg-white text-[#FC8D68] rounded-lg hover:bg-gray-100 transition-colors font-medium">Get Started</Link>
              </div>

              {/* Enterprise Plan */}
              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-2xl font-bold mb-4">Enterprise</h3>
                <div className="text-3xl font-bold mb-6">$199<span className="text-lg text-gray-500 font-normal">/mo</span></div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center"><Star className="w-5 h-5 text-[#FC8D68] mr-2" />All Pro Features</li>
                  <li className="flex items-center"><Star className="w-5 h-5 text-[#FC8D68] mr-2" />Multi-location Support</li>
                  <li className="flex items-center"><Star className="w-5 h-5 text-[#FC8D68] mr-2" />Priority Support</li>
                  <li className="flex items-center"><Star className="w-5 h-5 text-[#FC8D68] mr-2" />Custom Integration</li>
                </ul>
                <Link href="/business-registration" className="block text-center py-3 px-6 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">Contact Sales</Link>
              </div>
            </div>
          </div>
        </section>
      </ScrollAnimations>

      {/* Success Stories Section */}
      <ScrollAnimations animation="fade-up" delay={0.4}>
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">See how other pet businesses have transformed with GoPet AI.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Success Story 1 */}
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                <img src="https://images.unsplash.com/photo-1516734212186-65266f46771f?w=400&q=80" alt="Pet Grooming Success Story" className="w-full h-48 object-cover rounded-lg mb-6" />
                <h3 className="text-xl font-semibold mb-2">Pawsome Grooming</h3>
                <p className="text-gray-600 mb-4">"GoPet AI helped us increase bookings by 150% and streamline our operations."</p>
                <div className="flex items-center text-[#FC8D68]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>

              {/* Success Story 2 */}
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                <img src="https://images.unsplash.com/photo-1541881856704-3c4b2896c0f8?w=400&q=80" alt="Pet Daycare Success Story" className="w-full h-48 object-cover rounded-lg mb-6" />
                <h3 className="text-xl font-semibold mb-2">Happy Tails Daycare</h3>
                <p className="text-gray-600 mb-4">"Managing multiple locations became effortless with GoPet AI's platform."</p>
                <div className="flex items-center text-[#FC8D68]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>

              {/* Success Story 3 */}
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                <img src="https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=400&q=80" alt="Pet Training Success Story" className="w-full h-48 object-cover rounded-lg mb-6" />
                <h3 className="text-xl font-semibold mb-2">Elite Pet Training</h3>
                <p className="text-gray-600 mb-4">"Our client satisfaction scores improved by 45% since using GoPet AI."</p>
                <div className="flex items-center text-[#FC8D68]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollAnimations>

      {/* Ready to Transform Section */}
      <ScrollAnimations animation="fade-up" delay={0.5}>
        <section className="py-24 bg-[#FC8D68]">
          <div className="container mx-auto px-4 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Pet Business?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">Join thousands of successful pet businesses using GoPet AI to streamline their operations and delight their customers.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/business-registration" className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#FC8D68] rounded-lg hover:bg-gray-100 transition-colors text-lg font-medium hover:scale-102">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5 animate-bounce" />
              </Link>
              <Link href="#features" className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors text-lg font-medium hover:scale-102">
                Learn More
              </Link>
            </div>
          </div>
        </section>
      </ScrollAnimations>

      <Footer />
    </div>
  );
}
