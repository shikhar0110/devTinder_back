import validator from "validator";

const validationData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName || !emailId || !password) {
    throw new Error("Please provide all the details");
  } else if (firstName.length < 3 || firstName.length > 50) {
    throw new Error(
      "First Name should be of minimum 3 characters and maximum 50 characters"
    );
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Please provide a valid email address");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password should contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character"
    );
  }
};

export const validateEditProfileData = async (req) => { // ✅ Kept only one export
  const ALLOWED_UPDATES = [
    "photoURL",
    "about",
    "gender",
    "skills",
    "firstName",
    "lastName",
    "age",
  ];
  const updates = req.body;
  const isUpdateAllowed = Object.keys(updates).every((key) =>
    ALLOWED_UPDATES.includes(key)
  );

  return isUpdateAllowed;
};

export default validationData; // ✅ Keep default export
