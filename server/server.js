const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const printer = require('printer');

const PROTO_PATH = path.join(__dirname, '../grpc-proto/printer.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const proto = grpc.loadPackageDefinition(packageDefinition).printer;

function printPdf(call, callback) {
    console.log("Recebendo pedido de impressão...");
    const filePath = call.request.filePath;

    printer.printFile({
        filename: filePath,
        success: () => {
            console.log("Impressão enviada.");
            callback(null, { ok: true });
        },
        error: (err) => {
            console.error("Erro:", err);
            callback(err, null);
        }
    });
}

const server = new grpc.Server();
server.addService(proto.PrinterService.service, { printPdf });

server.bindAsync(
    '0.0.0.0:50051',
    grpc.ServerCredentials.createInsecure(),
    () => {
        console.log("gRPC server started on port 50051");
        server.start();
    }
);
