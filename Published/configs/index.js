const isProduction = process.env.ENV && process.env.ENV === "production";
module.exports = {
  limitPage: 3,
  isProduction: isProduction,
};
