import React from "react";
import { CheckCircle, Clock, Truck, Package } from "lucide-react";

const TrackOrder = ({ orderId }) => {
  // In a real app, fetch tracking details using orderId
  const trackingSteps = [
    {
      id: 1,
      title: "Order Placed",
      description: "Your order has been confirmed",
      date: "2024-03-01 09:30 AM",
      status: "completed",
      icon: Package,
    },
    {
      id: 2,
      title: "Processing",
      description: "Your order is being prepared",
      date: "2024-03-01 02:15 PM",
      status: "completed",
      icon: Clock,
    },
    {
      id: 3,
      title: "In Transit",
      description: "Your order is on the way",
      date: "2024-03-02 10:45 AM",
      status: "current",
      icon: Truck,
    },
    {
      id: 4,
      title: "Delivered",
      description: "Package will be delivered",
      date: "Estimated: 2024-03-03",
      status: "pending",
      icon: CheckCircle,
    },
  ];

  return (
    <div className="bg-theme-primary p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-theme-primary mb-6">
        Track Order #{orderId}
      </h2>

      <div className="relative">
        {trackingSteps.map((step, index) => (
          <div key={step.id} className="flex items-start mb-8 last:mb-0">
            <div className="relative">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center
                ${
                  step.status === "completed"
                    ? "bg-green-500"
                    : step.status === "current"
                    ? "bg-blue-500"
                    : "bg-theme-secondary"
                }`}
              >
                <step.icon
                  className={`w-4 h-4 
                  ${
                    step.status === "completed" || step.status === "current"
                      ? "text-white"
                      : "text-theme-primary"
                  }`}
                />
              </div>
              {index !== trackingSteps.length - 1 && (
                <div
                  className={`absolute left-4 top-8 w-px h-16
                  ${
                    step.status === "completed"
                      ? "bg-green-500"
                      : "bg-theme-secondary"
                  }`}
                />
              )}
            </div>

            <div className="ml-4 flex-1">
              <h3 className="text-lg font-medium text-theme-primary">
                {step.title}
              </h3>
              <p className="text-theme-secondary">{step.description}</p>
              <p className="text-sm text-theme-secondary mt-1">{step.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackOrder;
