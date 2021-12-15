function role(perm) {
  return (req, res, next) => {
    const s = req.body.role;
    if (perm == s) {
      next();
    } else {
      res.status(401).json("you dont have a permission for this page");
    }
  };
}
module.exports = role;
