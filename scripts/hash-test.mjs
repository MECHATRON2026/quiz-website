import bcrypt from 'bcryptjs';
const hash = await bcrypt.hash('TEST123', 10);
console.log(hash);