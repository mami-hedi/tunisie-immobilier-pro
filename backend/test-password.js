require('dotenv').config();
const bcrypt = require('bcryptjs');

const hash = '$2a$10$qPd2AFQze2G00Ez4RwQPwOmiFE8V4CVBIa3JiKJsA82DGApa48CD';

const passwords = ['123456', 'password', 'Admin@123', 'admin', '1234'];

passwords.forEach(p => {
  bcrypt.compare(p, hash).then(ok => {
    if (ok) console.log(`✅ Mot de passe trouvé : "${p}"`);
    else console.log(`❌ "${p}" incorrect`);
  });
});