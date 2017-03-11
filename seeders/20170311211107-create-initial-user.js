'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    
      return queryInterface.bulkInsert('Users', [{
        name: 'Test_User',
        password: 'password'
      }], {});
  },

  down: function (queryInterface, Sequelize) {

      return queryInterface.bulkDelete('Users', null, {});

  }
};
