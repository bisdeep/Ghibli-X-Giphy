const fs = require("fs");
const http = require("http");
const https = require("https");
const util = require("util");

const credentials = require("./auth/credentials.json");
const api_key = "GjQV5o6aoGcKrZ2tU7HGFkTpwch6kaPl";

const port = 3000;
const server = http.createServer();

server.on("listening", listen_handler);
server.listen(port);
function listen_handler() {
	console.log(`Now Listening on Port ${port}`);
}

server.on("request", request_handler);
function request_handler(req, res) {
	console.log(`New Request from ${req.socket.remoteAddress} for ${req.url}`);
	if (req.url === "/") {
		const form = fs.createReadStream("html/index.html");
		res.writeHead(200, { "Content-Type": "text/html" })
		form.pipe(res);
	}
	else if (req.url.startsWith("/search")) {
		const user_input = new URL(req.url, `https://${req.headers.host}`).searchParams;
		let title = user_input.get('title');
		res.writeHead(200, { "Content-Type": "text/html" });
		get_information(title, res);
	}
	else {
		res.writeHead(404, { "Content-Type": "text/html" });
		res.end(`<h1>404 Not Found</h1>`);
	}
}


function get_information(title, res) {

	const ghibli_endpoint = `https://ghibliapi.herokuapp.com/films?title=${title}`;
	const giphy_endpoint = `https://api.giphy.com/v1/gifs/search?api_key=${api_key}&q=${title}&limit=6&offset=0&rating=g&lang=en`;
	// const ghibli_request = https.request(ghibli_endpoint, { method: "GET" });

	let options = { tasks_completed: 0 };     //forcing pass by reference

	https.request(
		ghibli_endpoint,
		{ method: "GET" },
		(token_stream) => {
			process_stream(token_stream, parse_ghibli, options, res);

				https.request(
					giphy_endpoint,
					{ method: "GET" },
					(token_stream) => process_stream(token_stream, parse_giphy, options, res)
				).end();
			
		}
	).end();

	// ghibli_request.once("response", stream => process_stream(stream, parse_ghibli, options, res));
	// ghibli_request.end();
	// setTimeout(() => ghibli_request.end(), 1000);
	// console.log("API1 has been called");

	// redirect_to_giphy(title, options, res);
}
// function redirect_to_giphy(title, options, res) {

// 	console.log('----------------------- giphy -----------------------')
// 	// console.log(util.inspect(res))
// 	const giphy_endpoint = `https://api.giphy.com/v1/gifs/search?api_key=${api_key}&q=${title}&limit=4&offset=0&rating=g&lang=en`;
// 	const giphy_request = https.request(giphy_endpoint, { method: "GET" });
// 	giphy_request.once("response", stream => process_stream(stream, parse_giphy, options, res));
// 	giphy_request.end();
// 	console.log("API 2 HAS BEEN CALLED");

// }

function process_stream(stream, callback, ...args) {
	let body = "";
	stream.on("data", chunk => body += chunk);
	stream.on("end", () => callback(body, ...args));
}

function parse_giphy(title_data, options, res) {
	let giphy_object = JSON.parse(title_data);
	let gifs = giphy_object?.data;


	// gifs is an array that contains all entries in the "data" field of our search term
	let results = gifs.map(generate_gif).join('                 ');
	if (gifs.length === 0) {
		results = `<h1>No Results Found</h1>`;
	}
	else {
		results = `<ul>${results}</ul>`;
	}
	results = `<div style="display:inline-block; justify-content:space-between;">${results}</div>`
	res.write(results.padEnd(1024, " "), () => terminate(options, res));
	function generate_gif(gif) {
		let gif_url = gif?.images?.original?.url;
		let new_gif_url = "";

		let slash_count = 0;
		for (let i = 0; i < gif_url.length; i++) {
			if (slash_count != 5) {
				if (gif_url[i] == '/') {
					slash_count += 1;
				}
				new_gif_url += gif_url[i];
			}
		}
		new_gif_url += "giphy.gif";
		return `<img src="${new_gif_url}" height=357px width=457px>`;
	}

}

function parse_ghibli(movie_data, options, res) {
	const movie_object = JSON.parse(movie_data);
	console.log(movie_object);
	if (movie_object.length == 0){
		res.writeHead(404, { "Content-Type": "text/html" });
		res.end(`<h1>404 Not Found</h1>`);
		return;
	}
	let results = "<h1>No Results Found</h1>";
	results = `<h1>${movie_object[0]?.title}</h1><br/><dl>${movie_object[0]?.description}</dl>`;
	console.log(results);
	res.write(results.padEnd(1024, " "), () => terminate(options, res));

}

function terminate(options, res) {
	options.tasks_completed++;
	console.log(options);
	if (options.tasks_completed === 2) {
		res.end();
	}
}
