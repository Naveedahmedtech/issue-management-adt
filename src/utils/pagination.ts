export const generatePagination = (
    totalPages: number,
    currentPage: number,
    maxVisible: number = 7
  ): (number | string)[] => {
    const pagination: (number | string)[] = [];
  
    if (totalPages <= maxVisible) {
      // Show all pages if total pages are less than or equal to maxVisible
      for (let i = 1; i <= totalPages; i++) {
        pagination.push(i);
      }
    } else {
      const sideButtons = Math.floor((maxVisible - 3) / 2); // Reserve space for first, last, and ellipses
      let startPage = Math.max(2, currentPage - sideButtons); // Ensure start is at least 2
      let endPage = Math.min(totalPages - 1, currentPage + sideButtons); // Ensure end is at most totalPages - 1
  
      // Adjust range if it gets too close to the beginning or end
      if (startPage <= 2) {
        startPage = 2;
        endPage = maxVisible - 2;
      }
      if (endPage >= totalPages - 1) {
        startPage = totalPages - (maxVisible - 2);
        endPage = totalPages - 1;
      }
  
      // Always include the first page
      pagination.push(1);
  
      // Ellipsis before the range
      if (startPage > 2) {
        pagination.push("...");
      }
  
      // Include the current range with the active page
      for (let i = startPage; i <= endPage; i++) {
        pagination.push(i);
      }
  
      // Ellipsis after the range
      if (endPage < totalPages - 1) {
        pagination.push("...");
      }
  
      // Always include the last page
      pagination.push(totalPages);
    }
  
    return pagination;
  };
  