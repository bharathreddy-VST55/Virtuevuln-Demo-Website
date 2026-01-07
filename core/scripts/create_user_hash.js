// Script to generate password hash for user@demonslayer.com
// Run this in the backend container: docker exec -it <container> node scripts/create_user_hash.js
// Or run: cd backend && npm install argon2 && node scripts/create_user_hash.js

const argon2 = require('argon2');

async function generateHash() {
  try {
    const hash = await argon2.hash('user123');
    console.log('\n=== Password Hash for user123 ===');
    console.log(hash);
    console.log('\nSQL INSERT statement:');
    console.log(`INSERT INTO "user" (created_at, updated_at, email, password, first_name, last_name, is_admin, role, photo, company, card_number, phone_number, is_basic) VALUES (now(), now(), 'user@demonslayer.com', '${hash}', 'Regular', 'User', false, 'people', null, 'Demon Slayer Corps', '1234 5678 9012 3456', '+1 234 567 890', true);`);
  } catch (err) {
    console.error('Error generating hash:', err);
    console.log('\nNote: Install argon2 first: npm install argon2');
  }
}

generateHash();

