import AWS from 'aws-sdk';

AWS.config.update( {region: 'us-east-1'} );

const dynamo = new AWS.DynamoDB({ apiVersion: 'latest'});

const params: AWS.DynamoDB.CreateTableInput = {
    TableName: 'users',
    KeySchema: [
        {
            AttributeName: 'username',
            KeyType: 'HASH'
        }
    ],

    AttributeDefinitions: [
        {
            AttributeName: 'username',
            AttributeType: 'S'
        }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 3,
        WriteCapacityUnits: 3
    },
    StreamSpecification: {
        StreamEnabled: false
    }
};

dynamo.createTable(params, (err, data) => {
    if(err) {
        console.log("error", err);
    } else {
        console.log("Table created", data);
    }
})