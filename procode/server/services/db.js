const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const DATA_FILE = path.join(__dirname, '..', 'data', 'store.json');

let isMongoConnected = false;

// Initialize file store if not present
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({
    users: [],
    problems: [],
    submissions: [],
    notes: [],
    papers: [],
    reports: []
  }, null, 2), 'utf-8');
}

function readStore() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading store.json, reinitializing...', err);
    return { users: [], problems: [], submissions: [], notes: [], papers: [], reports: [] };
  }
}

function writeStore(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing store.json', err);
  }
}

function matchFilter(item, filter) {
  if (!filter || Object.keys(filter).length === 0) return true;
  for (const key of Object.keys(filter)) {
    if (key === '_id' || key === 'id') {
      const matchId = String(item._id || item.id) === String(filter[key]);
      if (!matchId) return false;
    } else if (typeof filter[key] === 'object' && filter[key] !== null) {
      if ('$in' in filter[key]) {
        if (!filter[key]['$in'].includes(item[key])) return false;
      } else if ('$gte' in filter[key]) {
        if (new Date(item[key]) < new Date(filter[key]['$gte'])) return false;
      }
    } else if (item[key] !== filter[key]) {
      return false;
    }
  }
  return true;
}

class JsonCollection {
  constructor(collectionName) {
    this.name = collectionName;
  }

  async find(filter = {}) {
    const store = readStore();
    const list = store[this.name] || [];
    return list.filter(item => matchFilter(item, filter));
  }

  async findOne(filter = {}) {
    const store = readStore();
    const list = store[this.name] || [];
    return list.find(item => matchFilter(item, filter)) || null;
  }

  async findById(id) {
    const store = readStore();
    const list = store[this.name] || [];
    return list.find(item => String(item._id || item.id) === String(id)) || null;
  }

  async create(doc) {
    const store = readStore();
    if (!store[this.name]) store[this.name] = [];
    const newDoc = {
      _id: doc._id || 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...doc
    };
    store[this.name].push(newDoc);
    writeStore(store);
    return newDoc;
  }

  async findByIdAndUpdate(id, update, options = {}) {
    const store = readStore();
    const list = store[this.name] || [];
    const idx = list.findIndex(item => String(item._id || item.id) === String(id));
    if (idx === -1) return null;

    const current = list[idx];
    let updated;
    if (update.$set) {
      updated = { ...current, ...update.$set, updatedAt: new Date().toISOString() };
    } else if (update.$inc) {
      updated = { ...current };
      for (const [k, v] of Object.entries(update.$inc)) {
        updated[k] = (updated[k] || 0) + v;
      }
      updated.updatedAt = new Date().toISOString();
    } else {
      updated = { ...current, ...update, updatedAt: new Date().toISOString() };
    }

    list[idx] = updated;
    writeStore(store);
    return options.new ? updated : current;
  }

  async updateOne(filter, update) {
    const item = await this.findOne(filter);
    if (!item) return { modifiedCount: 0 };
    await this.findByIdAndUpdate(item._id, update);
    return { modifiedCount: 1 };
  }

  async deleteOne(filter) {
    const store = readStore();
    const list = store[this.name] || [];
    const idx = list.findIndex(item => matchFilter(item, filter));
    if (idx !== -1) {
      list.splice(idx, 1);
      writeStore(store);
      return { deletedCount: 1 };
    }
    return { deletedCount: 0 };
  }

  async countDocuments(filter = {}) {
    const items = await this.find(filter);
    return items.length;
  }
}

async function connectDB() {
  const mongoUri = process.env.MONGODB_URI;
  if (mongoUri) {
    try {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
      isMongoConnected = true;
      console.log('Connected successfully to MongoDB Atlas / Database');
      return true;
    } catch (err) {
      console.warn('MongoDB connection failed, falling back to local persistent store:', err.message);
      isMongoConnected = false;
      return false;
    }
  } else {
    console.log('MONGODB_URI not provided. Operating seamlessly in high-performance local persistent mode.');
    isMongoConnected = false;
    return false;
  }
}

module.exports = {
  connectDB,
  isMongo: () => isMongoConnected,
  User: new JsonCollection('users'),
  Problem: new JsonCollection('problems'),
  Submission: new JsonCollection('submissions'),
  Note: new JsonCollection('notes'),
  Paper: new JsonCollection('papers'),
  Report: new JsonCollection('reports'),
  readStore,
  writeStore
};
