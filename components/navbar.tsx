"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ClipboardList, Search, ShoppingCart, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [location, setLocation] = useState<string>("Select location");
  const [isLoading, setIsLoading] = useState(false);
  const [searchPlaceholder, setSearchPlaceholder] = useState("");

  const services = [
    "Massage for Women & Couples",
    "Salon & Massage for Men",
    "House Deep Cleaning",
    "AC Repair & Cleaning",
    "Deep Cleaning & Pest Control",
    "Home Repairs & AC Cleaning",
  ];

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let currentIndex = 0;
    let currentText = "";
    let isDeleting = false;

    const typeWriter = () => {
      const currentService = services[currentIndex];
      const typingSpeed = 25;
      const deletingSpeed = 10;

      if (!isDeleting) {
        // Typing
        currentText = currentService.slice(0, currentText.length + 1);
        setSearchPlaceholder(currentText);

        if (currentText === currentService) {
          // Word complete - wait 2 seconds before deleting
          isDeleting = true;
          timeoutId = setTimeout(typeWriter, 1000);
          return;
        }
      } else {
        // Deleting
        currentText = currentService.slice(0, currentText.length - 1);
        setSearchPlaceholder(currentText);

        if (currentText === "") {
          isDeleting = false;
          currentIndex = (currentIndex + 1) % services.length;
          timeoutId = setTimeout(typeWriter, 500);
          return;
        }
      }

      timeoutId = setTimeout(
        typeWriter,
        isDeleting ? deletingSpeed : typingSpeed
      );
    };

    timeoutId = setTimeout(typeWriter, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  const detectLocation = () => {
    setIsLoading(true);

    // Check if we're in a secure context
    if (window.location.protocol !== 'https:' && process.env.NODE_ENV === 'development') {
      // In development, simulate a location response
      setTimeout(() => {
        setLocation("Dubai");
        setIsLoading(false);
      }, 1000);
      return;
    }

    if ("geolocation" in navigator) {
      const options = {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      };

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(
              `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${process.env.NEXT_PUBLIC_OPENCAGE_API_KEY}`
            );
            const data = await response.json();
            if (data.results && data.results[0]) {
              const city = data.results[0].components.city || 
                          data.results[0].components.town ||
                          data.results[0].components.state;
              setLocation(city || "Location detected");
            }
          } catch (error) {
            console.error("Error fetching location:", error);
            setLocation("Location not available");
          } finally {
            setIsLoading(false);
          }
        },
        (error) => {
          console.error("Error getting location:", error.message);
          if (error.message.includes("Only secure origins are allowed")) {
            setLocation("HTTPS required for location");
          } else {
            switch(error.code) {
              case error.PERMISSION_DENIED:
                setLocation("Location access denied");
                break;
              case error.POSITION_UNAVAILABLE:
                setLocation("Location unavailable");
                break;
              case error.TIMEOUT:
                setLocation("Request timed out");
                break;
              default:
                setLocation("Click to detect location");
            }
          }
          setIsLoading(false);
        },
        options
      );
    } else {
      setLocation("Geolocation not supported");
      setIsLoading(false);
    }
  };

  return (
    <nav className="border-b">
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo-taskmario.png"
            alt="TaskMario"
            width={150}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </Link>

        {/* Location Selector */}
        <button 
          onClick={detectLocation}
          disabled={isLoading}
          className="flex items-center gap-2 mx-4 text-sm hover:text-blue-600 transition-colors"
        >
          <MapPin className="h-4 w-4" />
          <span className="max-w-[200px] truncate">
            {isLoading ? "Detecting location..." : location}
          </span>
        </button>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search for '${searchPlaceholder}'...`}
              className="pl-9 w-full"
            />
          </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-4 ml-4">
          <Button variant="ghost" size="icon">
            <ClipboardList className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <ShoppingCart className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
