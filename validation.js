const Joi = require('joi');

const postUsersSchema = Joi.object({
  userId: Joi.string()
    .pattern(new RegExp(/^[a-zA-Z0-9]{3,20}$/))
    .required(),
  password: Joi.string()
    .pattern(new RegExp(/^[0-9]{3,20}$/))
    .required()
    .min(5),
  confirmPassword: Joi.string().required(),
});

module.exports = {
  signUp: async (userId, password, confirmPassword, already_Id) => {
    try {
      const result = await postUsersSchema.validateAsync({
        userId,
        password,
        confirmPassword,
      });
      const existUsers = already_Id;

      if (password !== confirmPassword) {
        return false;
      } else if (userId == password) {
        console.log('아이디와 패스워드는 다른 값이여야 합니다!');
        return false;
      } else if (existUsers) {
        console.log('이미 존재하고 있는 아이디!');
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  },
};
