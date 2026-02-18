"use client";

import { CheckCircle, Circle } from "lucide-react";

const steps = [
  { id: 1, name: "Address", description: "Shipping address" },
  { id: 2, name: "Review", description: "Order summary" },
  { id: 3, name: "Payment", description: "Payment method" },
];

interface CheckoutStepsProps {
  currentStep?: number;
}

export function CheckoutSteps({ currentStep = 1 }: CheckoutStepsProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex items-center">
              {step.id <= currentStep ? (
                <CheckCircle className="h-8 w-8 text-primary" />
              ) : (
                <Circle className="h-8 w-8 text-muted-foreground" />
              )}
              <div className="ml-3">
                <p
                  className={`text-sm font-medium ${
                    step.id <= currentStep
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>

            {index < steps.length - 1 && (
              <div
                className={`w-16 h-0.5 mx-4 ${
                  step.id < currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
