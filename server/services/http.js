import axios from "axios";
import https from "https";

export const http = axios.create({
  timeout:30000,
  maxRedirects:5,
  headers: { "User-Agent" : "ReaderApp/0.1 (student project)"},
  httpsAgent: new https.Agent({ keepAlive: true })
});