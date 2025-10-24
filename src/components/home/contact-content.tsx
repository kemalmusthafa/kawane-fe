"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const contactInfo = [
  {
    icon: Mail,
    title: "Email Us",
    description: "Send us an email anytime",
    details: "info@kawane-studio.com",
    action: "mailto:info@kawane-studio.com",
  },
  {
    icon: Phone,
    title: "Call Us",
    description: "Mon-Fri from 8am to 5pm",
    details: "+62 21 1234 5678",
    action: "tel:+622112345678",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    description: "Come say hello at our office",
    details: "Jakarta, Indonesia",
    action: "https://maps.google.com",
  },
  {
    icon: Clock,
    title: "Business Hours",
    description: "We're here to help",
    details: "Mon-Fri: 8am-5pm\nSat: 9am-3pm",
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
    question: "Do you ship internationally?",
    answer:
      "Yes, we ship to over 25 countries worldwide. Shipping costs and delivery times vary by location.",
  },
  {
    question: "How can I contact customer support?",
    answer:
      "You can reach us via email, phone, or live chat. Our support team is available Monday-Friday, 8am-5pm.",
  },
];

export function ContactContent() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Message sent successfully! We'll get back to you soon.");
      reset();
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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

      {/* Contact Form & Map */}
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg lg:text-xl font-semibold">
              Send us a Message
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-3 sm:space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1 sm:space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-xs sm:text-sm lg:text-base font-medium"
                  >
                    Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    {...register("name")}
                    className={`text-xs sm:text-sm lg:text-base ${
                      errors.name ? "border-destructive" : ""
                    }`}
                  />
                  {errors.name && (
                    <p className="text-[10px] sm:text-xs lg:text-sm text-destructive leading-tight">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-xs sm:text-sm lg:text-base font-medium"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    {...register("email")}
                    className={`text-xs sm:text-sm lg:text-base ${
                      errors.email ? "border-destructive" : ""
                    }`}
                  />
                  {errors.email && (
                    <p className="text-[10px] sm:text-xs lg:text-sm text-destructive leading-tight">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1 sm:space-y-2">
                <Label
                  htmlFor="subject"
                  className="text-xs sm:text-sm lg:text-base font-medium"
                >
                  Subject
                </Label>
                <Input
                  id="subject"
                  placeholder="What's this about?"
                  {...register("subject")}
                  className={`text-xs sm:text-sm lg:text-base ${
                    errors.subject ? "border-destructive" : ""
                  }`}
                />
                {errors.subject && (
                  <p className="text-[10px] sm:text-xs lg:text-sm text-destructive leading-tight">
                    {errors.subject.message}
                  </p>
                )}
              </div>

              <div className="space-y-1 sm:space-y-2">
                <Label
                  htmlFor="message"
                  className="text-xs sm:text-sm lg:text-base font-medium"
                >
                  Message
                </Label>
                <Textarea
                  id="message"
                  placeholder="Tell us how we can help..."
                  rows={4}
                  {...register("message")}
                  className={`text-xs sm:text-sm lg:text-base resize-none ${
                    errors.message ? "border-destructive" : ""
                  }`}
                />
                {errors.message && (
                  <p className="text-[10px] sm:text-xs lg:text-sm text-destructive leading-tight">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full text-xs sm:text-sm lg:text-base font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Map Placeholder */}
        <div className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg lg:text-xl font-semibold">
                Find Us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-48 sm:h-56 lg:h-64 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs sm:text-sm lg:text-base text-muted-foreground font-medium">
                    Interactive Map
                  </p>
                  <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground leading-relaxed">
                    Jakarta, Indonesia
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg lg:text-xl font-semibold">
                Quick Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3">
              <a
                href="/home/shipping"
                className="block text-xs sm:text-sm lg:text-base text-primary hover:text-primary/80 font-medium leading-tight transition-colors"
              >
                Shipping Information
              </a>
              <a
                href="/home/returns"
                className="block text-xs sm:text-sm lg:text-base text-primary hover:text-primary/80 font-medium leading-tight transition-colors"
              >
                Returns & Exchanges
              </a>
              <a
                href="/home/faq"
                className="block text-xs sm:text-sm lg:text-base text-primary hover:text-primary/80 font-medium leading-tight transition-colors"
              >
                Frequently Asked Questions
              </a>
              <a
                href="/home/size-guide"
                className="block text-xs sm:text-sm lg:text-base text-primary hover:text-primary/80 font-medium leading-tight transition-colors"
              >
                Size Guide
              </a>
            </CardContent>
          </Card>
        </div>
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
