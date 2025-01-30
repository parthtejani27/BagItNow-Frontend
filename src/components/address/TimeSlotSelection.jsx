import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, ChevronRight, ChevronLeft, Clock } from "lucide-react";
import moment from "moment";
import {
  fetchTimeslots,
  setSelectedTimeslot,
  setSelectedDate,
  selectAvailableTimeslots,
  selectSelectedDate,
  selectDeliveryLoading,
} from "../../store/slices/deliverySlice";

const TimeSlotSelection = ({ onClose }) => {
  const dispatch = useDispatch();
  const selectedDate = useSelector(selectSelectedDate);
  const availableSlots = useSelector(selectAvailableTimeslots);
  const isLoading = useSelector(selectDeliveryLoading);
  const [dates, setDates] = useState([]);

  // Generate dates for the week starting from today
  useEffect(() => {
    const generateDates = () => {
      const dateArray = [];
      const startDate = moment.utc(); // Today

      for (let i = 0; i < 7; i++) {
        const date = moment(startDate).add(i, "days");
        dateArray.push({
          date: date.format("YYYY-MM-DD"),
          dayName: date.format("ddd"),
          displayDate: date.format("MMM D"),
          isToday: date.isSame(moment(), "day"),
          isClosed: false,
        });
      }

      setDates(dateArray);
      dispatch(setSelectedDate(startDate.format("YYYY-MM-DD"))); // Default to today
    };

    generateDates();
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchTimeslots(selectedDate));
  }, [dispatch, selectedDate]);

  const handleDateSelect = (date) => {
    dispatch(setSelectedDate(date));
  };

  const handleTimeSelect = (slot) => {
    dispatch(setSelectedTimeslot(slot));
    onClose();
  };

  const handleNextDates = () => {
    const nextWeek = moment.utc(selectedDate).add(7, "days");
    dispatch(setSelectedDate(nextWeek.format("YYYY-MM-DD")));
  };

  const handlePrevDates = () => {
    const prevWeek = moment.utc(selectedDate).subtract(7, "days");
    // Prevent going before today
    if (prevWeek.isBefore(moment.utc(), "day")) return;

    dispatch(setSelectedDate(prevWeek.format("YYYY-MM-DD")));
  };

  const getAvailableSlots = () => {
    if (!Array.isArray(availableSlots)) return [];
    return availableSlots
      .filter(
        (slot) =>
          moment.utc(slot.startTime).format("YYYY-MM-DD") === selectedDate &&
          slot.isActive
      )
      .sort((a, b) => moment.utc(a.startTime).diff(moment.utc(b.startTime)));
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-4xl h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 flex justify-between items-center border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            Schedule Delivery
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Date Selection */}
        <div className="p-4 bg-gray-100">
          <div className="flex items-center space-x-4">
            {/* <button
              onClick={handlePrevDates}
              className="p-2 hover:bg-gray-300 rounded-full"
              disabled={moment(selectedDate).isSame(moment(), "day")}
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button> */}

            <div className="flex space-x-3 overflow-x-auto custom-scrollbar">
              {dates.map((date) => (
                <button
                  key={date.date}
                  onClick={() => handleDateSelect(date.date)}
                  className={`flex flex-col items-center p-3 rounded-lg transition flex-shrink-0 min-w-[90px] text-center ${
                    selectedDate === date.date
                      ? "bg-black text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  <span className="text-sm font-semibold">
                    {date.isToday ? "Today" : date.dayName}
                  </span>
                  <span className="text-xs">{date.displayDate}</span>
                </button>
              ))}
            </div>

            {/* <button
              onClick={handleNextDates}
              className="p-2 hover:bg-gray-300 rounded-full"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button> */}
          </div>
        </div>

        {/* Time Slots */}
        <div className="p-5 flex-1 overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-black rounded-full"></div>
            </div>
          ) : getAvailableSlots().length > 0 ? (
            getAvailableSlots().map((slot) => (
              <button
                key={slot._id}
                onClick={() => handleTimeSelect(slot)}
                className="w-full p-4 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-between mb-3"
              >
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-gray-700" />
                  <span className="text-gray-800 font-medium">
                    {moment(slot.startTime).format("h:mm A")} -{" "}
                    {moment(slot.endTime).format("h:mm A")}
                  </span>
                </div>
                <span className="text-xs text-gray-600">
                  {slot.remainingCapacity} slots available
                </span>
              </button>
            ))
          ) : (
            <div className="text-center text-gray-500 py-10">
              No available slots for this date.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-100">
          <button
            onClick={onClose}
            className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:opacity-90 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeSlotSelection;
