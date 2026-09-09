"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.middleware = void 0;
const routes_1 = require("../routes/"); // this router is connected to index.ts
const middleware = (App) => {
    App.use('/auth', routes_1.authRouter);
    App.use('/ui', routes_1.uiRouter);
    // you can add more. 
};
exports.middleware = middleware;
