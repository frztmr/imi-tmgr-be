"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateShifter = void 0;
const dateShifter = (dateStr) => {
    const [day, month, year] = dateStr.split("-");
    return `${year}-${month}-${day}`;
};
exports.dateShifter = dateShifter;
