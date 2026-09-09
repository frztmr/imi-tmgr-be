"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uiRouter = exports.authRouter = void 0;
const auth_1 = __importDefault(require("./auth/auth"));
exports.authRouter = auth_1.default;
const ui_1 = __importDefault(require("./ui/ui"));
exports.uiRouter = ui_1.default;
