const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  full_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Họ tên không được để trống' },
    },
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: { msg: 'Email đã tồn tại' },
    validate: {
      isEmail: { msg: 'Email không hợp lệ' },
    },
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: true,
    validate: {
      len: {
        args: [6, 255],
        msg: 'Mật khẩu phải có ít nhất 6 ký tự',
      },
    },
  },
  role: {
    type: DataTypes.ENUM('admin', 'teacher', 'student'),
    defaultValue: 'student',
  },
  avatar: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  address: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  code: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  major_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // Only for students
    references: {
      model: 'majors',
      key: 'id',
    },
  },
  pin_code: {
    type: DataTypes.STRING(255), // Will store hashed PIN
    allowNull: true,
  },
  reset_password_token: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  reset_password_expires: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  google_id: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  facebook_id: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  otp_code: {
    type: DataTypes.STRING(255), // Will store hashed OTP
    allowNull: true,
  },
  otp_expires: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'users',
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 10);
      }
      if (user.pin_code) {
        user.pin_code = await bcrypt.hash(user.pin_code, 10);
      }
      if (user.otp_code) {
        user.otp_code = await bcrypt.hash(user.otp_code, 10);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password') && user.password) {
        user.password = await bcrypt.hash(user.password, 10);
      }
      if (user.changed('pin_code') && user.pin_code) {
        user.pin_code = await bcrypt.hash(user.pin_code, 10);
      }
      if (user.changed('otp_code') && user.otp_code) {
        user.otp_code = await bcrypt.hash(user.otp_code, 10);
      }
    },
  },
});

// Instance method to compare password
User.prototype.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Instance method to compare PIN
User.prototype.comparePin = async function (candidatePin) {
  if (!this.pin_code) return false;
  return bcrypt.compare(candidatePin, this.pin_code);
};

// Remove sensitive fields from JSON output
User.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.password;
  delete values.pin_code;
  delete values.reset_password_token;
  delete values.reset_password_expires;
  delete values.otp_code;
  delete values.otp_expires;
  return values;
};

module.exports = User;
