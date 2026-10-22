"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const path_1 = require("path");
const app_module_1 = require("./app.module");
const mongo_exception_filter_1 = require("./common/mongo-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        rawBody: true,
    });
    app.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: 'Content-Type,Authorization,Accept-Language,X-Refresh-Token,stripe-signature,x-paystack-signature',
        credentials: true,
    });
    app.useStaticAssets((0, path_1.join)(process.cwd(), 'uploads'), { prefix: '/uploads/' });
    app.useGlobalFilters(new mongo_exception_filter_1.MongoExceptionFilter());
    const configService = app.get(config_1.ConfigService);
    const port = process.env.PORT || configService.get('PORT') || 3005;
    await app.listen(port, '0.0.0.0');
    console.log(`🚀 JasmarKids API running on http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map