const sequelize = require('../config/database');
const User = require('./User');
const Category = require('./Category');
const Material = require('./Material');
const Download = require('./Download');

// ---- Associations ----

// User has many Materials
User.hasMany(Material, { foreignKey: 'user_id', as: 'materials' });
Material.belongsTo(User, { foreignKey: 'user_id', as: 'author' });

// Category has many Materials
Category.hasMany(Material, { foreignKey: 'category_id', as: 'materials' });
Material.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

// User has many Downloads
User.hasMany(Download, { foreignKey: 'user_id', as: 'downloads' });
Download.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Material has many Downloads
Material.hasMany(Download, { foreignKey: 'material_id', as: 'downloads' });
Download.belongsTo(Material, { foreignKey: 'material_id', as: 'material' });

module.exports = {
  sequelize,
  User,
  Category,
  Material,
  Download,
};
