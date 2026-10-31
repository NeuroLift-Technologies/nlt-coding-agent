import { agentOS, setup } from "@rivet-dev/agentos";
import http from "node:http";

const vm = agentOS({});

const registry = setup({
	startEngine: false,
	startServices: false,
	runtime: "native",
	use: { vm },
});

await registry.start();

const port = Number(process.env.PORT ?? 8080);
http.createServer((req, res) => {
	res.writeHead(200, { "content-type": "application/json" });
	res.end(JSON.stringify({ app: "agentos-runner", actor: "vm", ok: true }));
}).listen(port);
console.log('HTTP server started');

const metricsPort = Number(process.env.RIVETKIT_METRICS_PORT ?? 9464);
http.createServer((req, res) => {
	if (req.method === "GET" && req.url.startsWith("/metrics")) {
		res.writeHead(200, { "content-type": "text/plain; version=0.0.4" });
		res.end(registry.routes.prometheusMetrics());
	} else {
		res.writeHead(404);
		res.end();
	}
}).listen(metricsPort, "127.0.0.1");
console.log('Metrics server started');
