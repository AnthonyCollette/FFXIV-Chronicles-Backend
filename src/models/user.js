module.exports = (sequelize, DataTypes) => {
  return sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: {
        notEmpty: {
          msg: "Un nom d'utilisateur est obligatoire",
        },
        msg: "Ce nom d'utilisateur est déjà pris.",
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: {
        msg: "Cet email est déjà pris.",
      },
      validate: {
        notEmpty: {
          msg: "Un email est obligatoire",
        },
        isEmail: { msg: "L'adresse email n'est pas valide" },
      },
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Un mot de passe est obligatoire",
        }
      },
    },
  });
};
