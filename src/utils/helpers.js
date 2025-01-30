// utils/helpers.js

export const formatDate = (dateString) => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", options);
};

export const formatTime = (timeString) => {
  const options = { hour: "2-digit", minute: "2-digit" };
  const date = new Date(timeString);
  return date.toLocaleTimeString("en-US", options);
};
