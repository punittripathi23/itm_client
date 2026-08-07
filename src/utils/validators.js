export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validatePaper = (paper) => {
  const errors = {};
  if (!paper.title?.trim()) errors.title = 'Title is required';
  if (!paper.authors?.trim()) errors.authors = 'Authors are required';
  if (!paper.abstract?.trim()) errors.abstract = 'Abstract is required';
  if (!paper.year || isNaN(paper.year)) errors.year = 'A valid year is required';
  if (!paper.conference?.trim()) errors.conference = 'Conference is required';
  if (!paper.category) errors.category = 'Category is required';
  if (!paper.pdfUrl?.trim()) errors.pdfUrl = 'PDF Link is required';
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
