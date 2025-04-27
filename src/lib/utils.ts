

export const formatToNaira = (amount: string | number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(typeof amount === "number" ? amount : parseFloat(amount));
};
