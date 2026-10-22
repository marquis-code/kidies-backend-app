import { Connection } from 'mongoose';
import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    private readonly connection;
    constructor(appService: AppService, connection: Connection);
    getHello(): string;
    getHealth(): {
        status: string;
        database: string;
        uptime: number;
        timestamp: string;
    };
}
