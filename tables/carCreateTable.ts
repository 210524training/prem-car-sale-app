import AWS from 'aws-sdk';

AWS.config.update( {region: 'us-east-1'} );

const dynamo = new AWS.DynamoDB({ apiVersion: 'latest'});

const params: AWS.DynamoDB.CreateTableInput = {
	TableName: 'cars',
	KeySchema: [
		{
			AttributeName: 'id',
			KeyType: 'HASH'
		}
	],
	AttributeDefinitions: [
		{
			AttributeName: 'id',
			AttributeType: 'N'
		},
		{
			AttributeName: 'owner',
			AttributeType: 'S'
		}
	],
	ProvisionedThroughput: {
		ReadCapacityUnits: 3,
		WriteCapacityUnits: 3
	},
	StreamSpecification: {
		StreamEnabled: false
	},
	GlobalSecondaryIndexes: [
		{
			IndexName: 'owner',
			KeySchema: [
				{
					AttributeName: 'owner',
					KeyType: 'HASH'
				}
			],
			Projection: {
				ProjectionType: 'ALL'
			},
			ProvisionedThroughput: {
				ReadCapacityUnits: 2,
				WriteCapacityUnits: 2
			}
		}
	]
};

dynamo.createTable(params, (err, data) => {
    if(err) {
        console.log("error", err);
    } else {
        console.log("Table created", data);
    }
})