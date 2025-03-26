import { handleRequest } from './dist/question-bank-frontend/server.mjs';

export default {
  async fetch(request: Request): Promise<Response> {
    return handleRequest(request);
  }
};