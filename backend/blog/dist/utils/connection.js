"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = require("mongoose");
const connectDB = async () => {
    try {
        await (0, mongoose_1.connect)(`mongodb+srv://admin:${process.env.MONGODB_PASSWORD}@cluster0.evsj75n.mongodb.net/?retryWrites=true&w=majority`);
        console.log('DB connected');
    }
    catch (error) {
        console.error(error);
        return error;
    }
};
exports.connectDB = connectDB;
//# sourceMappingURL=connection.js.map