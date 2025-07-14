// app/lib/appwrite.ts
import { Client, Databases, Storage, Account, ID } from "appwrite";

const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1") // Use your Appwrite endpoint if self-hosted
  .setProject("6807163400296f58b59c"); // Your Project ID, no fallback needed

const databases = new Databases(client);
const storage = new Storage(client);
export const account = new Account(client);
export { ID };

export { client, databases, storage };