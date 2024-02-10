/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: Sequelize.STRING,
      age: Sequelize.INTEGER,
      location: Sequelize.STRING,

    });

    await queryInterface.createTable('Arts', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: Sequelize.STRING(1000),
      artist: Sequelize.STRING,
      year: Sequelize.INTEGER,

    });

    await queryInterface.createTable('Comments', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      artID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Arts',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      userID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      name: Sequelize.STRING,
      content: Sequelize.TEXT,
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Comments');
    await queryInterface.dropTable('Arts');
    await queryInterface.dropTable('Users');
  },
};
