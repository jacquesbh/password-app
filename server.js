const http = require('http');
const { exec } = require('child_process');

const hostname = '0.0.0.0';
const port = 8080;

const server = http.createServer((req, res) => {
    if (req.url === '/') {
        exec("tr -dc 'A-Za-z0-9!?%=' < /dev/urandom | head -c 30", (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'text/plain');
                res.end(`Error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'text/plain');
                res.end(`Stderr: ${stderr}`);
                return;
            }
            const password = stdout.trim();
            const htmlContent = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Generated Password</title>
                </head>
                <body>
                    <pre id="password">${password}</pre>
                    <script>
                        function selectText() {
                            const password = document.getElementById('password');
                            const range = document.createRange();
                            range.selectNode(password);
                            window.getSelection().removeAllRanges();
                            window.getSelection().addRange(range);
                        }
                        selectText()
                    </script>
                </body>
                </html>
            `;
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end(htmlContent);
        });
    } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Not Found');
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
