'use strict';
module.exports = (sequelize, DataTypes) => {
  const Hello = sequelize.define('Hello', {
    name: DataTypes.STRING
  }, {});
  Hello.associate = function(models) {
    // associations can be defined here
  };
  return Hello;
};