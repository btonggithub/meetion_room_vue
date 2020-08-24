const { validationResult } = require("express-validator");

module.exports = (req, res, next) => {
  // validation
  req.validate = () => {
    const errors = validationResult(req).array();
    if (errors.length == 0) return;
    throw new Error(`${errors[0].param} : ${errors[0].msg}`);
  };
  // error
  res.error = (ex, status = 400) => {
    res.status(status).json({ message: ex.message });
  };

  next();
};
