/* eslint-disable camelcase */

/**
 * Creates a table named 'users' in a PostgreSQL database.
 * The table has four columns: 'id', 'username', 'password', and 'fullname'.
 * The 'id' column is of type VARCHAR(50) and is set as the primary key.
 * The 'username', 'password', and 'fullname' columns are all of type TEXT and are set as not null.
 *
 * @param {Object} pgm - The PostgreSQL migration instance.
 */
exports.up = (pgm) => {
  pgm.createTable('users', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    username: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    password: {
      type: 'TEXT',
      notNull: true,
    },
    fullname: {
      type: 'TEXT',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('users');
};
