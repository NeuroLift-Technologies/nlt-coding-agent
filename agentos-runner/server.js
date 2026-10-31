import { actor, setup } from "rivetkit";
import { AgentOs } from "@rivet-dev/agentos-core";
import http from "node:http";

export const RUNNER_VERSION = "agentos-runner-v3";

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
	res.end(JSON.stringify({ app: "agentos-runner", actor: "vm", ok: true, version: RUNNER_VERSION }));
}).listen(port);
console.log("HTTP server started");

const metricsPort = Number(process.env.RIVETKIT_METRICS_PORT ?? 9464);
http.createServer((req, res) => {
	const fail = (err) => {
		try {
			console.error("Metrics request error occurred:", err && err.message ? err.message : err);
			if (!res.headersSent) res.writeHead(500, { "content-type": "text/plain" });
			res.end("metrics error\n");
		} catch (_) { /* never crash the process on metrics */ }
	};
	(async () => {
		try {
			if (req.method === "GET" && (req.url ?? "").startsWith("/metrics")) {
				let body;
				let status = 200;
				let contentType = "text/plain; version=0.0.4; charset=utf-8";
				try {
					const out = await registry.routes.prometheusMetrics();
					if (out && typeof out.text === "function") {
						body = await out.text();
						status = out.status ?? 200;
						contentType = out.headers?.get?.("content-type") ?? contentType;
					} else if (typeof out === "string") {
						body = out;
					} else {
						body = String(out);
					}
				} catch (err) {
					console.error("prometheusMetrics unavailable:", err && err.message ? err.message : err);
					body = "# rivetkit metrics unavailable\n";
				}
				if (!res.headersSent) res.writeHead(status, { "content-type": contentType });
				res.end(body);
			} else {
				if (!res.headersSent) res.writeHead(404);
				res.end();
			}
		} catch (err) {
			fail(err);
		}
	})();
}).listen(metricsPort, "127.0.0.1");
console.log("Metrics server started");
console.log("RUNNER_VERSION:", RUNNER_VERSION);

process.on("uncaughtException", (err) => console.error("uncaughtException:", err && err.stack ? err.stack : err));
process.on("unhandledRejection", (err) => console.error("unhandledRejection:", err && err && err.stack ? err.stack : err));
