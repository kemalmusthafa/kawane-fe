"use client";

import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const contactInfo = [
  {
    icon: Mail,
    title: "Email Us",
    description: "Send us an email anytime",
    details: "kawane.studio1921@gmail.com",
    action: "mailto:kawane.studio1921@gmail.com",
  },
  {
    icon: Phone,
    title: "Call Us",
    description: "24/7 Customer Support",
    details: "+62 857 1309 3129",
    action: "tel:+685713093129",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    description: "Come say hello at our office",
    details: "Bandung, Indonesia",
    action:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3168.835434509374!2d107.5405235!3d-6.8657241!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e9f5f5f5f5f5%3A0x5f5f5f5f5f5f5f5f!2zNsKwNTEnNTYuNiJTIDEwN8KwMzInMzUuMiJF!5e0!3m2!1sen!2sid!4v1738560000000!5m2!1sen!2sid",
  },
  {
    icon: Clock,
    title: "Business Hours",
    description: "We're here to help",
    details: "Day and Night",
    action: null,
  },
];

const faqs = [
  {
    question: "How can I track my order?",
    answer:
      "Once your order ships, you'll receive a tracking number via email. You can also track your order in your account dashboard.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer a 30-day return policy for most items. Items must be in original condition with tags attached.",
  },
  {
    question: "How do I update my shipping address?",
    answer:
      "You can update your shipping address in your account settings under 'Addresses'.",
  },
  {
    question: "How can I contact customer support?",
    answer:
      "You can reach us via email, phone, or live chat. Our support team is available Monday-Friday, 8am-5pm.",
  },
];

export function ContactContent() {
  return (
    <div className="space-y-16 text-stable">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-3 sm:mb-4 lg:mb-6 leading-tight">
          Get in <span className="text-primary">Touch</span>
        </h1>
        <p className="text-xs sm:text-sm lg:text-base text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Have a question or need help? We're here to assist you. Reach out to
          us through any of the channels below.
        </p>
      </div>

      {/* Contact Info Cards */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {contactInfo.map((info, index) => (
          <Card
            key={index}
            className="text-center hover:shadow-lg transition-shadow h-full"
          >
            <CardContent className="p-3 sm:p-4 lg:p-6 flex flex-col justify-between h-full min-h-[140px] sm:min-h-[160px] lg:min-h-[180px]">
              <div>
                <info.icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary mx-auto mb-2 sm:mb-3 lg:mb-4" />
                <h3 className="text-xs sm:text-sm lg:text-base font-medium mb-1 sm:mb-2 leading-tight">
                  {info.title}
                </h3>
                <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground mb-2 sm:mb-3 leading-relaxed">
                  {info.description}
                </p>
              </div>
              <div className="mt-auto">
                {info.action ? (
                  <a
                    href={info.action}
                    className="text-[10px] sm:text-xs lg:text-sm text-primary hover:text-primary/80 font-medium leading-tight break-words"
                  >
                    {info.details}
                  </a>
                ) : (
                  <p className="text-[10px] sm:text-xs lg:text-sm whitespace-pre-line leading-relaxed">
                    {info.details}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Google Maps */}
      <div className="w-full">
        <div className="w-full h-[400px] sm:h-[500px] lg:h-[600px] rounded-lg overflow-hidden shadow-lg border">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3168.835434509374!2d107.5405235!3d-6.8657241!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e9f5f5f5f5f5%3A0x5f5f5f5f5f5f5f5f!2zNsKwNTEnNTYuNiJTIDEwN8KwMzInMzUuMiJF!5e0!3m2!1sen!2sid!4v1738560000000!5m2!1sen!2sid"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
            title="Kawane Studio Location - Cipageran, Cimahi"
          />
        </div>
        <p className="text-center mt-4 text-xs sm:text-sm text-muted-foreground">
          <a
            href="https://maps.app.goo.gl/wiK6FRSjKPdVxyuX8"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 underline"
          >
            Open in Google Maps
          </a>
        </p>
      </div>

      {/* FAQ Section */}
      <div>
        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-center mb-6 sm:mb-8 lg:mb-12 leading-tight">
          Frequently Asked Questions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {faqs.map((faq, index) => (
            <Card key={index} className="h-full">
              <CardContent className="p-4 sm:p-6 h-full flex flex-col">
                <h3 className="text-xs sm:text-sm lg:text-base font-medium mb-2 sm:mb-3 leading-tight">
                  {faq.question}
                </h3>
                <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground leading-relaxed flex-grow">
                  {faq.answer}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
