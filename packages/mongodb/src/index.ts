import { queryMongo, listMongoDatabases, listMongoCollections, MongoQueryOptions, MongoConnection } from "../../../src/connectors/mongodb";
import { DataSet } from "../../../packages/core/src/types";

export type { MongoQueryOptions, MongoConnection };
export type { DataSet } from "../../../packages/core/src/types";

function assertNonEmptyString(value: string, name: string): void {
  if (!value || typeof value !== "string") {
    throw new Error(`${name} must be a non-empty string`);
  }
}

export function createMongoConnection(uri: string, database: string): MongoConnection {
  assertNonEmptyString(uri, "uri");
  assertNonEmptyString(database, "database");
  return { uri, database };
}

// Loader function for a single collection
export async function loadMongoFromCollection(
  connection: MongoConnection,
  collectionName: string,
  query: Record<string, any> = {},
  options: MongoQueryOptions = {}
): Promise<DataSet> {
  assertNonEmptyString(connection?.uri as string, "connection.uri");
  assertNonEmptyString(connection?.database as string, "connection.database");
  assertNonEmptyString(collectionName, "collectionName");
  return await queryMongo(connection, collectionName, query, options);
}

// Loader for listing all databases
export async function loadMongoDatabases(connection: MongoConnection): Promise<string[]> {
  assertNonEmptyString(connection?.uri as string, "connection.uri");
  return await listMongoDatabases(connection);
}

// Loader for listing all collections in a database
export async function loadMongoCollections(
  connection: MongoConnection,
  dbName: string
): Promise<string[]> {
  assertNonEmptyString(connection?.uri as string, "connection.uri");
  assertNonEmptyString(dbName, "dbName");
  return await listMongoCollections(connection, dbName);
}

// Combined loader (to load entire DB snapshot if needed)
export async function loadMongoDatabaseSnapshot(
  connection: MongoConnection,
  dbName: string,
  query: Record<string, any> = {},
  options: MongoQueryOptions = {}
): Promise<Record<string, DataSet>> {
  assertNonEmptyString(connection?.uri as string, "connection.uri");
  assertNonEmptyString(dbName, "dbName");

  const collections = await listMongoCollections(connection, dbName);
  const entries = await Promise.all(
    collections.map(async (col) => {
      const data = await queryMongo(connection, col, query, options);
      return [col, data] as const;
    })
  );

  const snapshot: Record<string, DataSet> = {};
  for (const [col, data] of entries) snapshot[col] = data;
  return snapshot;
}

export default {
  loadMongoFromCollection,
  loadMongoDatabases,
  loadMongoCollections,
  loadMongoDatabaseSnapshot,
  createMongoConnection,
};
