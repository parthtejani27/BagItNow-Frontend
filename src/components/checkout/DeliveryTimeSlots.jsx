import React, { useState } from "react";
import { Calendar, Clock } from "lucide-react";

const DeliveryTimeSlots = ({ onSelectSlot, selectedSlot }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Generate next 7 days
  const getDateOptions = () => {
    const options = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      options.push({
        date: date,
        label:
          i === 0
            ? "Today"
            : i === 1
            ? "Tomorrow"
            : date.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              }),
      });
    }
    return options;
  };

  // Generate time slots for the selected date
  const getTimeSlots = () => {
    const slots = [];
    const isToday = selectedDate.toDateString() === new Date().toDateString();
    const currentHour = new Date().getHours();

    // Start from next available hour if it's today
    const startHour = isToday ? currentHour + 1 : 9;

    for (let hour = startHour; hour <= 21; hour++) {
      slots.push({
        time: `${hour}:00`,
        label: `${hour % 12 || 12}:00 ${hour >= 12 ? "PM" : "AM"}`,
      });
    }
    return slots;
  };

  return (
    <div className="mt-6 space-y-4">
      {/* Date Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-theme-primary flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Select Date
        </label>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {getDateOptions().map((option) => (
            <button
              key={option.date}
              onClick={() => setSelectedDate(option.date)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                selectedDate.toDateString() === option.date.toDateString()
                  ? "bg-accent-success text-white"
                  : "bg-theme-secondary text-theme-primary hover:bg-theme-tertiary"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Time Slots */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-theme-primary flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Select Time
        </label>
        <div className="grid grid-cols-3 gap-2">
          {getTimeSlots().map((slot) => (
            <button
              key={slot.time}
              onClick={() =>
                onSelectSlot({ date: selectedDate, time: slot.time })
              }
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                selectedSlot?.time === slot.time
                  ? "bg-accent-success text-white"
                  : "bg-theme-secondary text-theme-primary hover:bg-theme-tertiary"
              }`}
            >
              {slot.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeliveryTimeSlots;
