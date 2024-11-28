const path = require("path");
const { SendError } = require("../middleware/error");
const { formValidation } = require("../middleware/auth");
const UserService = require("../services/users");
const {
  sendResponse,
  saveImage,
  deleteImage,
  hashPass,
  createToken,
  getUniqNumber
} = require("../utils/utils");

const imageDir = path.join(
  __dirname,
  "../../uploads/users/"
);

const defineUser = (data, ignorePass) => {
  const { role_id, username, password, phone, photo } = data;
  const user = {
    role_id: {
      value: role_id,
      minLength: 1,
      maxLength: 1,
    },
    username: {
      value: username,
      minLength: 6,
    },
    password: {
      value: password,
      minLength: 8,
    },
    phone: {
      value: phone,
      minLength: 11,
      maxLength: 15,
    },
    photo: {
      value: photo,
    },
  }

  if (ignorePass) delete user.password;

  return user;
};

const userControllers = {
  getUsers: async (req, res, next) => {
    try {
      const { offset, limit, search, filter } = req.query;
      const users = await UserService.getUsers(offset, limit, search ?? "", filter);
      sendResponse(res, 200, "get users", users);
    } catch (error) {
      next(error);
    }
  },

  createUser: async (req, res, next) => {
    try {
      const image = req.file;
      req.body.photo = "default.png";
      const data = defineUser(req.body);
      formValidation(data);

      const checkUsername = await UserService.checkDuplicateUser(req.body.username);
      if (checkUsername) throw new SendError("username already used!", 400);

      if (image) {
        const filename = req.body.username + "-" + getUniqNumber() + "-" + image?.originalname;
        const file = imageDir + filename;
        await saveImage(file, image?.buffer);
        req.body.photo = filename;
      }

      req.body.password = hashPass(req.body.password);
      req.body.role_id = parseInt(req.body.role_id);
      const user = await UserService.createUser(req.body);
      sendResponse(res, 201, "successfully created user!.", user);
    } catch (error) {
      next(error);
    }
  },

  updateUser: async (req, res, next) => {
    try {
      const id = req.params.id;
      const image = req.file;
      const data = defineUser(req.body, true);
      formValidation(data);

      const checkUsername = await UserService.checkDuplicateUser(req.body.username);
      if (checkUsername && checkUsername.id != id) {
        throw new SendError("username already used!", 400);
      }

      if (image) {
        // if (req.body.photo !== "default.png") {
        //   const delFile = imageDir + req.body.photo;
        //   await deleteImage(delFile);
        // }
        // const filename = req.body.username + "-" + getUniqNumber() + "-" + image?.originalname;
        // const file = imageDir + filename;
        // await saveImage(file, image?.buffer);
        // req.body.photo = filename;
        const link = await saveImageToCloud(image?.buffer);
        req.body.photo = link;
      }

      if (!req.body.password) {
        delete req.body.password;
      } else {
        req.body.password = hashPass(req.body.password);
      }

      req.body.role_id = parseInt(req.body.role_id);
      const user = await UserService.updateUser(id, req.body);
      sendResponse(res, 200, "successfully updated user!.", user);
    } catch (error) {
      next(error);
    }
  },

  deleteUser: async (req, res, next) => {
    try {
      const id = req.params.id;
      const user = await UserService.getById(id);
      const deleteUser = await UserService.deleteUser(id);

      // if (user && user.photo !== "default.png") {
      //   const delFile = imageDir + user.photo;
      //   await deleteImage(delFile);
      // }

      sendResponse(res, 200, "sucessfully deleted user!.", deleteUser > 0 ? user : deleteUser);
    } catch (error) {
      next(error);
    }
  },

  getProfile: async (req, res, next) => {
    try {
      const id = req.user.id;
      const user = await UserService.getById(id);

      if (!user) throw new SendError("user not login!.", 400);
      const newToken = await createToken({
        id: user.id,
        role_id: user.role_id,
        username: user.username,
        role: user.role,
        slug: user.slug,
      });

      sendResponse(res, 200, "you are logged in", user, newToken);
    } catch (error) {
      next(error);
    }
  },

}

module.exports = userControllers;