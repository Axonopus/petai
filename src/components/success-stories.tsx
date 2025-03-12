"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Quote, Star } from "lucide-react";
import { ScrollAnimations } from "@/components/scroll-animations";

interface SuccessStory {
  id: number;
  name: string;
  business: string;
  image: string;
  quote: string;
  rating: number;
  metric?: string;
}

export default function SuccessStories() {
  const [activeStory, setActiveStory] = useState(0);

  const successStories: SuccessStory[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      business: "Pawsome Grooming",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80",
      quote: "GoPet has transformed how we manage our grooming business. Our bookings have increased by 40% since we started using the platform!",
      rating: 5,
      metric: "40% increase in bookings"
    },
    {
      id: 2,
      name: "Michael Chen",
      business: "Happy Tails Daycare",
      image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200&q=80",
      quote: "The loyalty program feature has helped us retain more customers. Our client return rate has improved significantly.",
      rating: 5,
      metric: "85% client retention rate"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      business: "Paws & Claws Veterinary",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80",
      quote: "The automated appointment system has reduced our administrative work by hours each week. Now we can focus more on pet care.",
      rating: 5,
      metric: "20 hours saved per week"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStory((current) =>
        current === successStories.length - 1 ? 0 : current + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [successStories.length]);

  return (
    <section className="py-20 bg-[#F5F7F3]">
      <div className="container mx-auto px-4">
        <ScrollAnimations animation="fade-up">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              See how pet businesses are growing with GoPet's all-in-one platform
            </p>
          </div>
        </ScrollAnimations>

        <div className="grid md:grid-cols-3 gap-8">
          {successStories.map((story, index) => (
            <ScrollAnimations
              key={story.id}
              animation="fade-up"
              delay={0.1 * (index + 1)}
            >
              <Card
                className={`relative overflow-hidden transition-all duration-500 ${index === activeStory ? 'scale-105 shadow-lg' : 'hover:scale-102 shadow-sm'}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <img
                        src={story.image}
                        alt={story.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">{story.name}</h3>
                      <p className="text-sm text-gray-500">{story.business}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <Quote className="w-8 h-8 text-[#FC8D68] opacity-20 mb-2" />
                    <p className="text-gray-700">{story.quote}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {[...Array(story.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-[#FC8D68] fill-current"
                        />
                      ))}
                    </div>
                    {story.metric && (
                      <div className="text-sm font-medium text-[#FC8D68]">
                        {story.metric}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </ScrollAnimations>
          ))}
        </div>
      </div>
    </section>
  );
}
