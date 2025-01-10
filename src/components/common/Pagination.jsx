const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center mt-8 space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-lg bg-theme-secondary text-theme-primary disabled:opacity-50"
      >
        Previous
      </button>
      {[...Array(totalPages)].map((_, index) => (
        <button
          key={index + 1}
          onClick={() => onPageChange(index + 1)}
          className={`px-4 py-2 rounded-lg ${
            currentPage === index + 1
              ? "bg-theme-primary text-theme-secondary"
              : "bg-theme-secondary text-theme-primary"
          }`}
        >
          {index + 1}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-lg bg-theme-secondary text-theme-primary disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
