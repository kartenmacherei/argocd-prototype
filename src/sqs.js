const { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } =require( "@aws-sdk/client-sqs");
const   { Consumer } = require("sqs-consumer");
const queueUrl = "https://sqs.eu-central-1.amazonaws.com/888855808949/argocd-prototype-queue";
const sqsClient = new SQSClient({ region: "eu-central-1" });

receiveMessages = () => {
    const app = Consumer.create({
        queueUrl ,
        handleMessage: async (message) => {
            console.log('MESSAGE', message)
           },
    });

    app.on("error", (err) => {
        console.error(err.message);
    });

    app.on("processing_error", (err) => {
        console.error(err.message);
    });

    app.start();
}

module.exports = { receiveMessages }