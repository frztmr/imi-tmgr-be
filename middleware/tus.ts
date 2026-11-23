// src/middleware/tus.ts

import { Request, Response, NextFunction } from "express";
import { Server } from "@tus/server";
import { FileStore } from "@tus/file-store";
import path from "path";

// Storage directory
const uploadDirectory = path.resolve(
  process.cwd(),
  "storage/uploads"
);

// Tus server
export const tusServer = new Server({
  path: "/kebakaran/mark1/files/tus",

  datastore: new FileStore({
    directory: uploadDirectory,
  }),

  // Maximum upload size: 100 MB
  //   maxSize: 100 * 1024 * 1024,
 
  // Maximum upload size: 1 GB
    maxSize: 1000 * 1024 * 1024,
});