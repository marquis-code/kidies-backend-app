"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: (origin, callback) => {
            callback(null, origin || true);
        },
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: [
            'Origin',
            'X-Requested-With',
            'Content-Type',
            'Accept',
            'Authorization',
            'Accept-Language',
            'x-refresh-token',
            'Cache-Control',
            'Pragma',
        ],
        exposedHeaders: ['Authorization', 'x-refresh-token'],
        credentials: true,
        maxAge: 86400,
    });
    const configService = app.get(config_1.ConfigService);
    const port = process.env.PORT || configService.get('PORT') || 3002;
    await app.listen(port, '0.0.0.0');
}
bootstrap();
//# sourceMappingURL=main.js.map