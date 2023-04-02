import { createReadStream } from "fs";
import path from 'path'

export default function (app) {
    app.use('/favicon.ico', (req, res, next)=>{
        const stream = createReadStream(path.resolve(__dirname, 'favicon.ico'));
        stream.pipe(res);
    })
}
