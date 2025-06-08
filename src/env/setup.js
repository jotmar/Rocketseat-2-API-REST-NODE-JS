"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
var dotenv_1 = require("dotenv");
var zod_1 = require("zod");
if (process.env.NODE_ENV === 'test') {
    (0, dotenv_1.config)({
        path: '.env.test',
    });
}
else {
    (0, dotenv_1.config)();
}
var envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z
        .enum(['development', 'test', 'production'])
        .default('development'),
    DATABASE_URL: zod_1.z.string(),
    DATABASE_CLIENT: zod_1.z.enum(['pg', 'sqlite3']),
    PORT: zod_1.z.coerce.number().default(3333),
});
var _env = envSchema.safeParse(process.env);
if (!_env.success) {
    console.error('Invalid Enviroment Argument!', _env.error.format());
    throw new Error('Invalid Enviroment Argument!');
}
exports.env = _env.data;
