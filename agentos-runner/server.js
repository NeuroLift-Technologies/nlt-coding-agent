import { actor, setup } from "rivetkit";
import { AgentOs } from "@rivet-dev/agentos-core";
import http from "node:http";

export const vm = actor({
	state: {},
	actions: {
		run: async (_c, { command } = {}) => {
			const os = await AgentOs.create();
			try {
				const result = await os.process.exec(String(command ?? "echo hello from agentOS"), {
					output: { capture: "all" },
				});
				return { stdout: result.stdout, stderr: result.stderr };
			} finally {
				await os.dispose();
			}
		},
	},
});

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
http.createServer(async (req, res) => {
	try {
		if (req.method === "GET" && req.url.startsWith("/metrics")) {
			const response = await registry.routes.prometheusMetrics();
			const text = await response.text();
			res.writeHead(response.status, {
				"content-type": response.headers.get("content-type") ?? "text/plain; version=0.0.4",
			});
			res.end(text);
		} else {
			res.writeHead(404);
			res.end();
		}
	} catch (err) {
		console.error('Metrics request error occurred');
		if (!res.headersSent) res.writeHead(500);
		res.end();
	}
}).listen(metricsPort, "127.0.0.1");
console.log('Metrics server started');
