import grpc from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';
import { fileURLToPath } from 'url';
import { loginGrpc } from './controllers/authController.js';
import { getConversationGrpc } from './controllers/conversationController.js';
import { getGigGrpc } from './controllers/gigController.js';
import { getMessageGrpc } from './controllers/messageController.js';
import { getOrderGrpc } from './controllers/orderController.js';
import { getReviewGrpc } from './controllers/reviewController.js';
import { getUserGrpc } from './controllers/userController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROTO_PATH = path.resolve(__dirname, 'protos', 'service.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const freelancerProto = protoDescriptor.freelancer;

const server = new grpc.Server();

server.addService(freelancerProto.AuthService.service, {
  Login: loginGrpc,
});

server.addService(freelancerProto.ConversationService.service, {
  GetConversation: getConversationGrpc,
});

server.addService(freelancerProto.GigService.service, {
  GetGig: getGigGrpc,
});

server.addService(freelancerProto.MessageService.service, {
  GetMessage: getMessageGrpc,
});

server.addService(freelancerProto.OrderService.service, {
  GetOrder: getOrderGrpc,
});

server.addService(freelancerProto.ReviewService.service, {
  GetReviews: getReviewGrpc,
});

server.addService(freelancerProto.UserService.service, {
  GetUser: getUserGrpc,
});

server.bindAsync('localhost:50051', grpc.ServerCredentials.createInsecure(), () => {
  console.log('gRPC server running at http://localhost:50051');
});