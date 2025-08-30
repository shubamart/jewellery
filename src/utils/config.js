// src/config.js

// 👇 manually control environment
const IS_DEV = false; // change to false for production

// const DEV_URL = 'http://10.0.2.2/inventory/backend/';
const DEV_URL = 'http://192.168.1.6/inventory/backend/';
const PROD_URL = 'http://work.bonlineinfotech.com/';
// http://work.bonlineinfotech.com/db.php

// use your flag
export const BASE_URL = IS_DEV ? DEV_URL : PROD_URL;

// also export it for checking
export const APP_ENV = IS_DEV ? "development" : "production";
