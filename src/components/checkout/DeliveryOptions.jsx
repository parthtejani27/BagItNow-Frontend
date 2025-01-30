const DeliveryOptions = ({ selectedOption, onOptionSelect, options }) => {
  console.log(selectedOption);

  return (
    <div className="p-6 bg-theme-primary rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold text-theme-primary mb-6">
        Delivery options
      </h2>

      <div className="space-y-4">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onOptionSelect(option.id)}
            className={`w-full p-4 rounded-lg border transition-colors duration-200 flex justify-between items-center ${
              selectedOption === option.id
                ? "border-green-600 bg-green-50 dark:bg-green-900/10"
                : "border-theme-primary hover:bg-theme-secondary"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`p-2 rounded-full ${
                  option.type === "priority"
                    ? "bg-green-100 text-green-600"
                    : "bg-theme-secondary"
                }`}
              >
                {option.icon}
              </div>
              <div className="text-left">
                <p className="font-medium text-theme-primary">{option.title}</p>
                <p className="text-sm text-theme-secondary">
                  {option.description}
                </p>
              </div>
            </div>
            {option.price && (
              <span className="text-theme-primary font-medium">
                +CA${option.price}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DeliveryOptions;
