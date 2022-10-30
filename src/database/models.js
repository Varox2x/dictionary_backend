const { DataTypes } = require('sequelize');
const db = require('./databse')

const users = db.define('users', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {

});

const sets = db.define('sets', {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "users",
      key: "id"
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
      indexes: [
        {
          unique: true,
          fields: ['user_id', 'name']
        }
      ]
});

const words = db.define('words', {
  name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  definition: {
    type: DataTypes.STRING,
    allowNull: true
  },
  lvl: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
})

const words_sets = db.define('words_sets', {
  set_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "sets",
      key: "id"
    }
  },
  word_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "words",
      key: "id"
    }
  }
})

db.sync().then(() => {
    console.log("Tables Created")
})


module.exports = {users, sets, words, words_sets}