const isProduction = process.env.ENV && process.env.ENV.trim() === "production";
module.exports = {
  limitPage: 3,
  isProduction: isProduction,
};
