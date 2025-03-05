export const adminAuth = (req, res, next) => {
  console.log("Admin is getting checked");
  const checkAuth = true;
  if (!checkAuth) {
    res.status(401).send("You are not authorized to access this page");
  } else {
    console.log("Admin is authorized");
    next();
  }
};

export const userAuth = (req, res, next) => {
  console.log("User is getting checked");
  const checkAuth = true;
  if (!checkAuth) {
    res.status(401).send("You are not authorized to access this page");
  } else {
    console.log("User is authorized");
    next();
  }
};
