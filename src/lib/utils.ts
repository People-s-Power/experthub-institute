
// export const trainingsBaseURL = 'https://seashell-app-nejbh.ondigitalocean.app';
export const trainingsBaseURL = 'https://expert-trainings-api-unhmf.ondigitalocean.app';

export const formatToNaira = (amount: string | number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(typeof amount === "number" ? amount : parseFloat(amount));
};
