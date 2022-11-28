Title: Observable with local files and Flask
Author: Andy Reagan
Category: Programming
Tags: observable, web development, development environment
Date: 2020-09-15

We're relying heavily on [Observable](https://observablehq.com/@berkeleyvis) for the most recent edition of Berkeley MIDS W209: Information Visualization.
While Observable is a hosted tool, there are a handful of tricks that make is useful for enterprise applications (where data needs to reside locally).
One of these is relying on locally accessible data: Observable runs in _your browser_, so it can access local files if you serve them or an entire local webapp or API.
Here, we'll connect an observable front-end to a both some simple file-serving web servers and to a Python Flask server running on my laptop to demonstrate how this is possible.

## Basic Flask setup

For more details, follow along with the [Flask quickstart](https://flask.palletsprojects.com/en/1.1.x/quickstart/).
We'll start with the hello world app there:

    # hello.py
    from flask import Flask
    app = Flask(__name__)

    @app.route('/')
    def hello_world():
        return 'Hello, World!'

Which we run in debug mode with

    FLASK_ENV=development FLASK_APP=hello.py flask run

skip the `FLASK_ENV` option if you don't want debug mode.
Now that's not doing much for us,
so let's make a API:

    from flask import Flask
    app = Flask(__name__)

    @app.route('/')
    def hello_world():
        return 'Hello, World!'

    @app.route('/api/')
    @app.route('/api/<filename>/')
    def api(filename=None):
        if filename:
            # you could go load a file
            # json.loads(Path(filename).read_text())
            d = {'data': [1, 2, 3]}
        else:
            # maybe go query a database?
            d = {'query_result': ['a', 'b', 'c']}

        # we just need to return the dict object
        # flask will treat returned dict objects as json responses
        # (flask will treat returned strings, like from hello_world(), as response bodies with default headers and content type)
        return d

Cool, now we have an API in Flask.
In the response header, it set the `Content-Type: application/json` (rather than the standard HTML page type of `Content-Type: text/html; charset=utf-8`; FWIW I just copied both of those from the Network tab of Chrome's Inspector tool).
Of course you could do anything you want inside of `api()` or `hello_world()` functions,
like run a [Tensorflow model](https://www.tensorflow.org/) on some data that was just uploaded via POST request,
and return the score from the model as an JSON "API" response.

## CORS

The first thing we'll have to think about is [Cross-Origin Resource Sharing](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS).
Web browsers protect users by not allowing a website to host the content of a different site unless that site specifically allows it.
That means that I can't run githubb.com, show the github.com site's pages, and collect all of the details entered through my proxy site.
The github.com pages come back with headers that don't explicitly allow my site, githubb.com, and so it's not allowed (this operates as a white list).

All this to say that our local site that hosting files will need to allow specifically `observablehq.com` to use them!
We can be a little more relaxed and just allow any site to use our locally hosted files, by allowing `*` if we want (these are only visible on our computer).

Options for [CORS with Flask](https://flask.palletsprojects.com/en/1.1.x/quickstart/#about-responses):
- Just return `(response, {'Access-Control-Allow-Origin', 'observablehq.com'})`.
- Or if you're included the status, `(response, 200, {'Access-Control-Allow-Origin', '*'})`.

For our hello world, that would be:

    def hello_world():
        return 'Hello, World!', 200, {'Access-Control-Allow-Origin': '*'}

Options for CORS just serving files with node [http-server](https://www.npmjs.com/package/http-server):
- Just set the `--cors` flag.

For CORS just serving files with `python3 -m http.server`, there is [no simple option](https://stackoverflow.com/a/21957017/2577988).
You can wrap the simple server, but at this point, I'd recommend just using one of the two above.
Since we don't need to allow `*` and we're setting the header directly, we'll just allow Observable.
The [Python http.server documentation](https://docs.python.org/3/library/http.server.html) shows us how we can do it (note, this is a bit simpler than the solution provided in the SO post linked to above):

    from http.server import HTTPServer, SimpleHTTPRequestHandler

    class CORSRequestHandler(SimpleHTTPRequestHandler):
        def end_headers(self):
            self.send_header('Access-Control-Allow-Origin', 'observablehq.com')
            SimpleHTTPRequestHandler.end_headers(self)

    httpd = HTTPServer(('localhost', 8080), CORSRequestHandler)

    httpd.serve_forever()

## SSL

Again for our own good, most browsers won't allow a site running in HTTPS mode (a site that served content encrypted by SSL) to load assets from HTTP endpoints.
If they did, it might look like a site is secure with the "lock" icon, all while it's making unencrypted transactions with our data under the hood.
Observable is only serving on HTTPS, so we also need to serve with HTTPS.

Flask, http-server, and Python3's simple server all serve without SSL by default.
For any of these, we can wrap them in [ngrok](https://ngrok.com/).
This is probably the simplest solution for development:
- Go create an account at [ngrok](https://ngrok.com/).
- Download the executable for your platform.
- `mv ngrok /usr/local/bin` (or somewhere on your `PATH`).
- Set you authtoken: `ngrok authtoken 1h3V...`.
- Run it: `ngrok http 8080`, using the port of the service you want to expose.

Done! Only the final step is necessary each time you want to use it.

To get started with SSL in any other option,
first we can generate a local key pair by [following instructions here](https://gist.github.com/cecilemuller/9492b848eb8fe46d462abeb26656c4f8).
First, I create a file `domains.ext`:

    authorityKeyIdentifier=keyid,issuer
    basicConstraints=CA:FALSE
    keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
    subjectAltName = @alt_names
    [alt_names]
    DNS.1 = localhost
    DNS.2 = fake1.local
    DNS.3 = fake2.local

Then run the following 5 commands:

    openssl req -x509 -nodes -new -sha256 -days 1024 -newkey rsa:2048 -keyout RootCA.key -out RootCA.pem -subj "/C=US/CN=W209-CA"
    openssl x509 -outform pem -in RootCA.pem -out RootCA.crt
    openssl req -new -nodes -newkey rsa:2048 -keyout localhost.key -out localhost.csr -subj "/C=US/ST=Massachusetts/L=Amherst/O=Example-Certificates/CN=localhost.local"
    openssl x509 -req -sha256 -days 90 -in localhost.csr -CA RootCA.pem -CAkey RootCA.key -CAcreateserial -extfile domains.ext -out localhost.crt
    open RootCA.crt

The last command opens the cert in Mac's Keychain Access.
You need to double click the new key,
open the "Trust" section,
and always trust this CA.

Options for SSL just serving files with node [http-server](https://www.npmjs.com/package/http-server):
- We can just set the `--ssl/S` flag, and pass cert/key with `--cert` and `--key` options.

    http-server -S --cert localhost.crt --key localhost.key

Options for SSL with Python's simple server ([ref](https://blog.anvileight.com/posts/simple-python-http-server/#python-3-x-1)):

    from http.server import HTTPServer, SimpleHTTPRequestHandler
    import ssl


    httpd = HTTPServer(('localhost', 4443), SimpleHTTPRequestHandler)

    httpd.socket = ssl.wrap_socket(httpd.socket,
            keyfile="localhost.key",
            certfile="localhost.crt", server_side=True)

    httpd.serve_forever()

Or we can switch to using Python [Twisted](https://twistedmatrix.com/trac/):

    twistd -no web --path
    # with SSL
    twistd -no web --path –https=443 -c localhost.crt -k localhost.key

Flask from the CLI:

    FLASK_ENV=development FLASK_APP=hello.py flask run --cert localhost.crt --key localhost.key

There is an option to generate self-signed cert on the fly,
but it didn't work for me (`NET::ERR_CERT_AUTHORITY_INVALID`):

    FLASK_ENV=development FLASK_APP=hello.py flask run --cert=adhoc

## All together

The simplest solution for files:
we can serve local files to Observable with two lines (and the `ngrok` setup) with just:

    http-server --cors
    ngrok http 8080

and then pointing Observable to the ngrok https [URI](https://stackoverflow.com/questions/176264/what-is-the-difference-between-a-uri-a-url-and-a-urn) it gives you.
It should be clear how to combine any of the CORS solutions with ngrok for https.
To combine the CORS and SSL, with the self signed certs: first generate the certs as above, then:

### Node simple server (http-server)

    http-server --cors -S --cert localhost.crt --key localhost.key

### Python simple server

    from http.server import HTTPServer, SimpleHTTPRequestHandler
    import ssl

    class CORSRequestHandler(SimpleHTTPRequestHandler):
        def end_headers(self):
            self.send_header('Access-Control-Allow-Origin', 'observablehq.com')
            SimpleHTTPRequestHandler.end_headers(self)

    httpd = HTTPServer(('localhost', 8080), CORSRequestHandler)

    httpd.socket = ssl.wrap_socket(httpd.socket,
            keyfile="localhost.key",
            certfile="localhost.crt", server_side=True)

    httpd.serve_forever()

Then run from the command line

    python3 script.py

### Flask

Already done!
Just take `hello.py` with the CORS headers,
and run it with the certs passed in.

Or you can run `python hello.py` and set the certs inside the script:

    if __name__ == '__main__':
        app.run(debug=True, ssl_context=('localhost.crt', 'localhost.key'))

## Connect to Observable

The last part is just fun now.
Spin up an Observable notebook,
import d3 (`d3 = require("d3@6")`),
and load our Flask API:

    d3.json("https://localhost:5000/api/")
