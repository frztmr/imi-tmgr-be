"use strict";
// all contoller 
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uiController = exports.authController = void 0;
const auth_1 = __importDefault(require("./auth"));
exports.authController = auth_1.default;
const ui_1 = __importDefault(require("./ui/ui"));
exports.uiController = ui_1.default;
