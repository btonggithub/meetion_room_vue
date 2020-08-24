const utilityFn = {
  tolocalDate_EN(value) {
    return new Date(
      new Date(value).toLocaleString("en-US", { timeZone: "Asia/Bangkok" })
    );
  },
  toResponseDate_US(value) {
    return value.toLocaleString("en-US");
  },
};

module.exports = utilityFn;
