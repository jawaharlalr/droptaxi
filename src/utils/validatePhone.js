// src/utils/validatePhone.js
const validatePhone = (phone) => {
  return /^[6-9]\d{9}$/.test(phone);
};

export default validatePhone;
