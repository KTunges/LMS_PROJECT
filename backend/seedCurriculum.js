const { Sequelize } = require('sequelize');
require('dotenv').config({ path: './.env' });

const sequelize = new Sequelize(
  process.env.DB_NAME || 'lms_db',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'postgres',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    
    // Check existing
    const [existing] = await sequelize.query('SELECT count(*) FROM curriculums');
    if (parseInt(existing[0].count) > 0) {
      console.log('Curriculums already seeded.');
    } else {
      // Seed CNTT (Major 1)
      await sequelize.query(`
        INSERT INTO curriculums (major_id, course_id, semester_number, is_required, created_at, updated_at) VALUES 
        (1, 1, 1, true, NOW(), NOW()),
        (1, 2, 1, true, NOW(), NOW()),
        (1, 7, 2, true, NOW(), NOW()),
        (1, 8, 2, false, NOW(), NOW());
      `);

      // Seed QTKD (Major 2)
      await sequelize.query(`
        INSERT INTO curriculums (major_id, course_id, semester_number, is_required, created_at, updated_at) VALUES 
        (2, 6, 1, true, NOW(), NOW()),
        (2, 3, 1, true, NOW(), NOW()),
        (2, 8, 2, false, NOW(), NOW());
      `);

      // Seed MKT (Major 3)
      await sequelize.query(`
        INSERT INTO curriculums (major_id, course_id, semester_number, is_required, created_at, updated_at) VALUES 
        (3, 6, 1, true, NOW(), NOW()),
        (3, 5, 1, true, NOW(), NOW()),
        (3, 3, 2, true, NOW(), NOW());
      `);

      console.log('Curriculums seeded successfully!');
    }
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    process.exit(0);
  }
})();
