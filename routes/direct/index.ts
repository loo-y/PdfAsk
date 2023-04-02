import fs from 'fs'
import path from 'path'
import { findSpecificDir } from '../util'



export default function (app) {
    app.use('/pdf.worker.js', async (req, res, next)=>{
        const rootDir = await findSpecificDir({startPath: __dirname, specificFile: "package.json"});
        const pdfworkerjs = path.resolve(rootDir, './node_modules/pdfjs-dist/build/pdf.worker.js')
        console.log(`this is /pdf.worker.js`)
        fs.readFile(pdfworkerjs, (err, data) => {
            if (err) {
                console.log(`fs error`, err)
                res.setHeader('Content-Type', 'text/plain');
                res.status(404);
                res.end('404 Not Found\n');
                return;
            }
            res.setHeader('Content-Type', 'application/javascript');
            res.write(data);
            res.end();
        })

    })
}
