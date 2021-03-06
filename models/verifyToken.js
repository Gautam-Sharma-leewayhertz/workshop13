const jwt = require("jsonwebtoken");
const express = require("express");

module.exports = function (req, res, next) {
  const token = req.header("auth-token");
  if (!token) return res.status(401).send("invalid token/access denied");

  try {
    const verified = jwt.verify(token, "gautam123");
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).send("invalid token");
  }
};
