const { SendError } = require("./error");
const { getByCredentials } = require("../services/auth");
const {
  verifyToken,
  createToken,
  sendResponse,
  comparePass
} = require("../utils/utils");

exports.paginationQueryValidate = (req, res, next) => {
  let pagination = {
    offset: req.query.offset,
    limit: req.query.limit,
  }
  for (const key in pagination) {
    if (!pagination[key]) throw new SendError(key + " " + "is required", 400);
    if (isNaN(parseInt(pagination[key]))) throw new SendError(key + " " + "must be a number", 400);
  }
  next();
}

exports.formValidation = (listField) => {
  for (const field in listField) {
    if (!listField[field].value) throw new SendError(field + " is required", 400);
    if (listField[field].minLength && listField[field].value?.length < listField[field].minLength) {
      throw new SendError("minimal character for " + field + " is " + listField[field].minLength, 400);
    }
    if (listField[field].maxLength && listField[field].value?.length > listField[field].maxLength) {
      throw new SendError("maximum character for " + field + " is " + maxLength, 400);
    }
  }
}

exports.auth = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization?.split(" ")[1];
    if (!authorization) {
      let err = new SendError();
      err.statusCode = 401;
      err.message = "invalid credentials !";
      throw err;
    }
    const payload = verifyToken(authorization);
    if (!payload) {
      let err = new SendError();
      err.statusCode = 401;
      err.message = "invalid credentials !";
      throw err;
    }
    req.user = payload;
    next();
    return;
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username) throw new SendError("username is required!.", 400);
    if (!password) throw new SendError("password is required!.", 400);

    const find = await getByCredentials(username);
    if (!find) {
      let err = new SendError();
      err.statusCode = 404;
      err.message = "username not registered !";
      throw err;
    }
    const isMatch = await comparePass(password, find.password);
    if (!isMatch) {
      let err = new SendError();
      err.statusCode = 401;
      err.message = "wrong password !";
      throw err;
    }
    delete find.password;
    const payload = {
      id: find.id,
      role_id: find.role_id,
      username: find.username,
      role: find.role,
      slug: find.slug,
    };
    const token = await createToken(payload);
    sendResponse(res, 200, "login successfully !", find, token);
  } catch (error) {
    next(error);
  }
}

exports.isAdmin = (req, res, next) => {
  if (req.user.slug === "admin") next();
  else throw new SendError("unauthorized!.", 401)
}