import Image from "next/image";
import Link from "next/link";
import { Star, Users } from "lucide-react";

const services = [
  {
    title: "Part-Time Cleaners",
    Image: "/icons/Part-Time Cleaners.webp",
    href: "/services/cleaners"
  },
  {
    title: "Monthly Cleaning Subscription",
    Image: "/icons/Monthly Cleaning Subscription.webp",
    href: "/services/subscription"
  },
  {
    title: "All-in-one House Help",
    Image: "/icons/All-in-one House Help.webp",
    href: "/services/house-help",
    isNew: true
  },
  {
    title: "Salon, Nails & Hair for Women",
    Image: "/icons/Salon & Nails for Women.webp",
    href: "/services/salon-women"
  },
  {
    title: "Massage for Women & Couples",
    Image: "/icons/Massage for Women & Couples.webp",
    href: "/services/massage"
  },
  {
    title: "Salon & Massage for Men",
    Image: "/icons/Salon & Massage for Men.webp",
    href: "/services/salon-men"
  },
  {
    title: "Home Repairs & AC Cleaning",
    Image: "/icons/Home Repairs & AC Cleaning.webp",
    href: "/services/repairs"
  },
  {
    title: "Deep Cleaning & Pest Control",
    Image: "/icons/Deep Cleaning & Pest Control.webp",
    href: "/services/deep-cleaning"
  }
];

export function Hero() {
  const mainServices = services.slice(0, 6);
  const bottomServices = services.slice(6);

  const ServiceCard = ({ service }: { service: typeof services[0] }) => (
    <Link
      href={service.href}
      className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
    >
      <div className="relative w-16 h-16 mx-auto mb-2">
        <Image
          src={service.Image}
          alt={service.title}
          width={64}
          height={64}
          className="object-contain"
        />
      </div>
      <p className="text-sm text-center group-hover:text-blue-600">
        {service.title}
        {service.isNew && (
          <span className="ml-1 inline-block px-2 py-0.5 text-xs bg-blue-600 text-white rounded">
            NEW
          </span>
        )}
      </p>
    </Link>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Left Column */}
        <div>
          <h1 className="text-4xl font-bold mb-8">
            Home services at your doorstep
          </h1>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-lg mb-4">What are you looking for?</h2>
            
            <div className="space-y-4">
              {/* First grid: 3x2 for first 6 services */}
              <div className="grid grid-cols-3 gap-4">
                {mainServices.map((service) => (
                  <ServiceCard key={service.title} service={service} />
                ))}
              </div>

              {/* Second grid: 2x1 for last 2 services */}
              <div className="grid grid-cols-2 gap-4">
                {bottomServices.map((service) => (
                  <ServiceCard key={service.title} service={service} />
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-8 mt-8 bg-blue-50 rounded-lg p-8 shadow-sm">
            <div className="flex items-center gap-4">
              <Star className="w-10 h-10 text-yellow-400" />
              <div>
                <div className="text-3xl font-bold">4.8</div>
                <div className="text-base text-gray-600">Service Rating</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Users className="w-10 h-10 text-blue-600" />
              <div>
                <div className="text-3xl font-bold">12M+</div>
                <div className="text-base text-gray-600">Customers Globally</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Image */}
        <div className="rounded-2xl overflow-hidden h-[600px]">
          <Image
            src="/images/service image.webp"
            alt="Urban Company Services"
            width={600}
            height={600}
            className="object-cover w-full h-full"
            priority
          />
        </div>
      </div>
    </div>
  );
}
