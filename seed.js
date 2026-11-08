require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');
const path = require('path');

const isOid = v => typeof v === 'string' && /^[0-9a-f]{24}$/i.test(v);
const isoDate = /^\d{4}-\d{2}-\d{2}(T.*)?$/;
const dateKeys = ['fecha', 'fechaPublicacion', 'createdAt'];

function convert(value, key) {
  if (Array.isArray(value)) return value.map(v => convert(v, key));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, convert(v, k)]));
  }
  if (isOid(value)) return new ObjectId(value);
  if (dateKeys.includes(key) && typeof value === 'string' && isoDate.test(value)) {
    return new Date(value);
  }
  return value;
}

(async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db();
  console.log('Conectado a la base de datos:', db.databaseName);

  for (const col of ['users', 'events', 'posts']) {
    const file = path.join(__dirname, 'data', `${col}_data.json`);
    const docs = JSON.parse(fs.readFileSync(file, 'utf8')).map(d => convert(d));
    await db.collection(col).deleteMany({});
    const res = await db.collection(col).insertMany(docs);
    console.log(`${col}: ${res.insertedCount} documentos`);
  }

  await db.collection('users').createIndex({ email: 1 }, { unique: true });
  await db.collection('events').createIndex({ slug: 1 }, { unique: true });
  await db.collection('posts').createIndex({ slug: 1 }, { unique: true });
  console.log('Índices únicos creados');

  await client.close();
})().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});