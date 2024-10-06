import fs from 'fs';
import winston from 'winston';
import { url } from 'inspector';


const fsPromise = fs.promises;

// async function log(logData) {
//     try {
//         logData = `\n${new Date().toString()}-${logData}`;
//         // writeFile overwrites the data so that we are using appendFile instead of that.
//         await fsPromise.appendFile('log.txt', logData);
//     } catch (error) {
//         console.log(error);
//     }
// }

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'request-logging' },
    transports: [
        new winston.transports.File({ filename: 'logs.txt' })
    ]
})

const logMiddleware = async (req, res, next) => {
    // 1.log the request body.
    if (!req.url.includes('signin')) {
        // Following code logs body also.
        // const logData = `${req.url}-${JSON.stringify(req.body)}`;
        const logData = `${req.url}`;
        // await log(logData);
        logger.info(logData);
    }
    next();
};

// export default { logMiddleware, logger };
export default logMiddleware;