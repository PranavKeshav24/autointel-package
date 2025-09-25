import { MongoClient, Db, Document } from "mongodb";
import type { FindCursor } from "mongodb";
import { DataSet, RecordData } from "../../packages/core/src/types";
import { normalizeRows, inferSchema } from "../../packages/core/src/preprocess";


export interface MongoConnection {
  uri: string;
  database: string;
}

export interface MongoQueryOptions {
  limit?: number;
  projection?: Record<string, 0 | 1>;
  sort?: Record<string, 1 | -1>;
  batchSize?: number;
  maxTimeMS?: number;
}


function convertBsonValue(value: any): any {
  if (value && typeof value === "object") {
    if (Array.isArray(value)) return value.map(convertBsonValue);

    const bsonType = (value as any)._bsontype as string | undefined;
    if (bsonType) {
      switch (bsonType) {
        case "ObjectId":
          return value.toString();
        case "Decimal128":
          return parseFloat(value.toString());
        case "Long":
          return Number(value.toString());
        case "Int32":
          return value.valueOf();
        case "Double":
          return value.valueOf();
        case "Timestamp":
          return Number(value.valueOf());
        case "Binary":
          return Buffer.from((value as any).buffer).toString("base64");
        case "Date":
          return new Date(value).toISOString();
        default:
          break;
      }
    }

    if (value instanceof Date) return value.toISOString();

    const out: Record<string, any> = {};
    for (const [k, v] of Object.entries(value)) out[k] = convertBsonValue(v);
    return out;
  }
  return value;
}

function bsonToJsonFriendly(doc: Document): RecordData {
  const out: Record<string, any> = {};
  for (const [key, value] of Object.entries(doc)) out[key] = convertBsonValue(value);
  return out;
}

function assertValidConnection(conn: MongoConnection): void {
  if (!conn || typeof conn !== "object") throw new Error("Invalid Mongo connection: expected object");
  if (!conn.uri || typeof conn.uri !== "string") throw new Error("Invalid Mongo connection: 'uri' must be a non-empty string");
  if (!conn.database || typeof conn.database !== "string") throw new Error("Invalid Mongo connection: 'database' must be a non-empty string");
}

function createMongoClient(uri: string): MongoClient {
  return new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 20000,
  });
}

function applyCursorOptions<T extends Document>(
  cursor: FindCursor<T>,
  options: MongoQueryOptions
): FindCursor<T> {
  const transforms: Array<(c: FindCursor<T>) => FindCursor<T>> = [
    options.sort ? (c: FindCursor<T>) => c.sort(options.sort!) : undefined,
    options.limit ? (c: FindCursor<T>) => c.limit(options.limit!) : undefined,
    options.batchSize ? (c: FindCursor<T>) => c.batchSize(options.batchSize!) : undefined,
    options.maxTimeMS ? (c: FindCursor<T>) => c.maxTimeMS(options.maxTimeMS!) : undefined,
  ].filter(Boolean) as Array<(c: FindCursor<T>) => FindCursor<T>>;

  return transforms.reduce((c: FindCursor<T>, fn: (c: FindCursor<T>) => FindCursor<T>) => fn(c), cursor);
}

export async function queryMongo(
  conn: MongoConnection,
  collection: string,
  query: Record<string, any> = {},
  options: MongoQueryOptions = {}
): Promise<DataSet> {
  assertValidConnection(conn);
  const client = createMongoClient(conn.uri);
  await client.connect();
  try {
    const db: Db = client.db(conn.database);
    let cursor = db.collection(collection).find(query, { projection: options.projection });
    cursor = applyCursorOptions(cursor, options);

    const docs = await cursor.toArray();
    const rows = docs.map(bsonToJsonFriendly);
    const normalized = normalizeRows(rows);
    const schema = inferSchema(normalized);

    return {
      schema,
      rows: normalized,
      source: { kind: "mongodb", name: `${conn.database}.${collection}` },
    };
  } finally {
    await client.close();
  }
}


export async function listMongoDatabases(conn: MongoConnection): Promise<string[]> {
  assertValidConnection(conn);
  const client = createMongoClient(conn.uri);
  await client.connect();
  try {
    const result = await client.db().admin().listDatabases();
    return result.databases.map((db: { name: string }) => db.name);
  } finally {
    await client.close();
  }
}


export async function listMongoCollections(
  conn: MongoConnection,
  database: string
): Promise<string[]> {
  assertValidConnection(conn);
  const client = createMongoClient(conn.uri);
  await client.connect();
  try {
    const collections = await client.db(database).listCollections().toArray();
    return collections.map((c: { name: string }) => c.name);
  } finally {
    await client.close();
  }
}

