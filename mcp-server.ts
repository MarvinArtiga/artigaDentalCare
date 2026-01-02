
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// Create server instance
const server = new Server(
    {
        name: "cindy-mcp-server",
        version: "1.0.0",
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "hello_world",
                description: "A simple hello world tool to demonstrate MCP",
                inputSchema: {
                    type: "object",
                    properties: {
                        name: {
                            type: "string",
                            description: "Name to greet",
                        },
                    },
                    required: ["name"],
                },
            },
            {
                name: "get_server_time",
                description: "Returns the current time on the server",
                inputSchema: {
                    type: "object",
                    properties: {},
                }
            }
        ],
    };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    if (name === "hello_world") {
        const greetingName = String(args?.name || "World");
        return {
            content: [
                {
                    type: "text",
                    text: `Hello, ${greetingName}! This comes from your project's local MCP server.`,
                },
            ],
        };
    }

    if (name === "get_server_time") {
        return {
            content: [
                {
                    type: "text",
                    text: `Current server time is: ${new Date().toISOString()}`
                }
            ]
        }
    }

    throw new Error(`Tool not found: ${name}`);
});

// Start the server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Cindy MCP Server running on stdio");
}

main().catch((error) => {
    console.error("Server error:", error);
    process.exit(1);
});
