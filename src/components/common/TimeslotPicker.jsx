import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchAvailableTimeslots } from "../../store/slices/deliverySlice";

const TimeslotPicker = ({ onSelect, selectedSlot }) => {
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [visibleDates, setVisibleDates] = useState([]);

  const availableTimeslots = useSelector(
    (state) => state.delivery.availableTimeslots
  );
  const loading = useSelector((state) => state.delivery.loading);

  // Generate next 7 days
  useEffect(() => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    setVisibleDates(dates);
  }, []);

  // Fetch timeslots when date changes
  useEffect(() => {
    if (selectedDate) {
      dispatch(fetchAvailableTimeslots(selectedDate.toISOString()));
    }
  }, [selectedDate, dispatch]);

  const formatDate = (date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    }
    if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    }
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Group timeslots by time ranges (morning, afternoon, evening)
  const groupedTimeslots = availableTimeslots.reduce((acc, slot) => {
    const hour = new Date(slot.startTime).getHours();
    let timeOfDay = "morning"; // 6-12
    if (hour >= 12 && hour < 17) timeOfDay = "afternoon"; // 12-5
    if (hour >= 17) timeOfDay = "evening"; // 5-10

    if (!acc[timeOfDay]) acc[timeOfDay] = [];
    acc[timeOfDay].push(slot);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {/* Date Selector */}
      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <button
            className="p-1 hover:bg-theme-secondary rounded-full transition-colors"
            onClick={() => {
              const newDates = visibleDates.map((date) => {
                const newDate = new Date(date);
                newDate.setDate(date.getDate() - 7);
                return newDate;
              });
              setVisibleDates(newDates);
            }}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex-1 overflow-x-auto">
            <div className="flex gap-2">
              {visibleDates.map((date) => (
                <button
                  key={date.toISOString()}
                  onClick={() => setSelectedDate(date)}
                  className={`flex-1 min-w-[100px] p-2 rounded-lg border transition-colors ${
                    selectedDate.toDateString() === date.toDateString()
                      ? "border-accent-success bg-accent-success/10 text-accent-success"
                      : "border-theme-secondary hover:border-theme-primary"
                  }`}
                >
                  <div className="text-sm font-medium">{formatDate(date)}</div>
                  <div className="text-xs text-theme-tertiary">
                    {date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button
            className="p-1 hover:bg-theme-secondary rounded-full transition-colors"
            onClick={() => {
              const newDates = visibleDates.map((date) => {
                const newDate = new Date(date);
                newDate.setDate(date.getDate() + 7);
                return newDate;
              });
              setVisibleDates(newDates);
            }}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Time Slots */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-pulse text-theme-tertiary">
            Loading available slots...
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedTimeslots).map(([timeOfDay, slots]) => (
            <div key={timeOfDay} className="space-y-2">
              <h4 className="text-sm font-medium text-theme-tertiary capitalize">
                {timeOfDay}
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {slots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => onSelect(slot)}
                    disabled={slot.currentOrders >= slot.maxOrders}
                    className={`flex items-center gap-2 p-3 rounded-lg border transition-colors ${
                      selectedSlot?.id === slot.id
                        ? "border-accent-success bg-accent-success/10 text-accent-success"
                        : slot.currentOrders >= slot.maxOrders
                        ? "border-theme-tertiary bg-theme-secondary text-theme-tertiary cursor-not-allowed"
                        : "border-theme-secondary hover:border-theme-primary"
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">
                      {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                    </span>
                    {slot.currentOrders >= slot.maxOrders && (
                      <span className="text-xs text-theme-tertiary ml-auto">
                        Full
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {Object.keys(groupedTimeslots).length === 0 && (
            <div className="text-center py-8 text-theme-tertiary">
              No delivery slots available for this date.
              <br />
              Please select another date.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TimeslotPicker;
