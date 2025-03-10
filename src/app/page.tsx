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

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <ClientNavbar />

      {/* Hero Section - Split Screen */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2 order-2 md:order-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Streamline Your Pet Business
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg">
                The ultimate management platform for pet care businesses.
                Simplify operations, enhance client engagement, and grow your
                business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/business-registration"
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
            </div>
            <div className="w-full md:w-1/2 order-1 md:order-2">
              <div className="relative rounded-xl overflow-hidden shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1587560699334-cc4ff634909a?w=800&q=80"
                  alt="Pet business owner using GoPet AI platform"
                  className="w-full h-auto object-cover rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
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
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-[#FC8D68] mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <Link
                  href={feature.link}
                  className="text-[#FC8D68] font-medium hover:underline inline-flex items-center"
                >
                  Learn More
                  <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Tiers Section */}
      <section className="py-24 bg-white" id="pricing">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Choose the Right Plan for Your Business
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Flexible pricing options to fit businesses of all sizes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="border border-gray-200 rounded-xl p-8 bg-white shadow-sm hover:shadow-md transition-all">
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <p className="text-gray-500 mb-4">Perfect for new businesses</p>
              <div className="text-4xl font-bold mb-6">
                $0
                <span className="text-lg text-gray-500 font-normal">
                  /month
                </span>
              </div>

              <ul className="space-y-3 mb-8">
                {[
                  "Basic Calendar",
                  "Up to 50 clients",
                  "Simple invoicing",
                  "Email support",
                ].map((feature, i) => (
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
                href="/business-registration"
                className="block text-center py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors w-full"
              >
                Get Started
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="border-2 border-[#FC8D68] rounded-xl p-8 bg-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#FC8D68] text-white px-4 py-1 text-sm font-medium rounded-bl-lg">
                MOST POPULAR
              </div>
              <h3 className="text-2xl font-bold mb-2">Premium</h3>
              <p className="text-gray-500 mb-4">For growing pet businesses</p>
              <div className="text-4xl font-bold mb-6">
                $49
                <span className="text-lg text-gray-500 font-normal">
                  /month
                </span>
              </div>

              <ul className="space-y-3 mb-8">
                {[
                  "Smart Calendar with AI optimization",
                  "Unlimited clients",
                  "Full POS & invoicing system",
                  "Custom booking pages",
                  "Client loyalty program",
                  "Business analytics",
                  "Priority support",
                ].map((feature, i) => (
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
                href="/business-registration"
                className="block text-center py-3 px-6 bg-[#FC8D68] hover:bg-[#e87e5c] text-white rounded-lg font-medium transition-colors w-full"
              >
                Upgrade Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-20 bg-gray-50" id="testimonials">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              See how pet businesses are thriving with GoPet AI.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img
                    src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&q=80"
                    alt="Sarah J."
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">Sarah J.</h4>
                  <p className="text-sm text-gray-500">Happy Tails Grooming</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "Since implementing GoPet AI, we've seen a 30% increase in
                bookings and significantly reduced no-shows. The client
                management system is a game-changer!"
              </p>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80"
                    alt="Michael T."
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">Michael T.</h4>
                  <p className="text-sm text-gray-500">Paws & Play Daycare</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "Our administrative workload has been cut in half. The automated
                invoicing and loyalty program have helped us retain 25% more
                clients year over year."
              </p>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img
                    src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&q=80"
                    alt="Jennifer R."
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">Jennifer R.</h4>
                  <p className="text-sm text-gray-500">
                    Furry Friends Veterinary
                  </p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "The custom booking pages have transformed our scheduling
                process. We've reduced phone calls by 40% while increasing our
                online appointment bookings."
              </p>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA Section */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to transform your pet business?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of pet care professionals who are streamlining their
            operations with GoPet AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/business-registration"
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
        </div>
      </section>

      <Footer />
    </div>
  );
}
