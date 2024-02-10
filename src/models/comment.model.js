module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    content: DataTypes.TEXT,
    userID: DataTypes.INTEGER,
    artID: DataTypes.INTEGER,
  }, {
    timestamps: false,
  });

  Comment.associate = (models) => {
    Comment.belongsTo(models.Art, {
      foreignKey: 'artID',
      as: 'art',
    });
    Comment.belongsTo(models.User, {
      foreignKey: 'userID',
      as: 'user',
    });
  };

  return Comment;
};
