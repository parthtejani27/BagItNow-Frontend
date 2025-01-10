import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Calendar, Clock } from "lucide-react";
import {
  selectSelectedTimeslot,
  selectSelectedDate,
  setSelectedTimeslot,
} from "../../store/slices/deliverySlice";
import moment from "moment";

const TimePreference = ({ onSchedule }) => {
  const selectedTimeslot = useSelector(selectSelectedTimeslot);
  const selectedDate = useSelector(selectSelectedDate);

  const formatDate = (date) => {
    const today = moment().format("YYYY-MM-DD");
    const tomorrow = moment().add(1, "day").format("YYYY-MM-DD");

    if (date === today) {
      return "Today";
    } else if (date === tomorrow) {
      return "Tomorrow";
    } else {
      return moment.utc(date).format("ddd, MMM D");
    }
  };

  const formatTime = (timeslot) => {
    console.log(timeslot);
    if (["standard", "priority"].includes(timeslot)) {
      return `${moment(timeslot.startTime).format("h:mm a")} - ${moment(
        timeslot.endTime
      ).format("h:mm a")}`;
    } else {
      return "Deliver now";
    }
  };

  return (
    <div>
      <h3 className="text-lg font-bold text-theme-primary mb-4">
        Time preference
      </h3>
      <div className="flex items-center gap-2 text-theme-primary">
        <Calendar className="w-5 h-5" />
        <span className="font-medium">
          {selectedDate ? formatDate(selectedDate) : "Select a date"}
        </span>
        {selectedDate ? (
          <>
            <span>,</span>
            <Clock className="w-5 h-5" />
            <span className="font-medium">{formatTime(selectedTimeslot)}</span>
          </>
        ) : null}

        <button
          onClick={onSchedule}
          className="ml-auto px-4 py-2 bg-theme-secondary text-theme-primary rounded-full
            hover:bg-theme-tertiary transition-colors"
        >
          Schedule
        </button>
      </div>
    </div>
  );
};

export default TimePreference;
