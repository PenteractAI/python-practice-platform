const handleRequest = async (request) => {
    return Response.json('Hello world!');
};


console.log("Launching server on port 7777");
const portConfig = { port: 7777, hostname: '0.0.0.0' };
Deno.serve(portConfig, handleRequest);
