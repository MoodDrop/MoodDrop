// api/index.ts
import app, { bootServerOnce } from "../server/index";

export default async function handler(req: any, res: any) {
  await bootServerOnce();
  return app(req, res);
}