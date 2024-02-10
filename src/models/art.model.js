module.exports = (sequelize, DataTypes) => {
  const Art = sequelize.define('Art', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: DataTypes.STRING(1000),
    artist: DataTypes.STRING,
    year: DataTypes.NUMBER,
  }, {
    timestamps: false,
  });

  Art.associate = (models) => {
    Art.hasMany(models.Comment, {
      foreignKey: 'artID',
      as: 'comments',
    });
  };

  return Art;
};
