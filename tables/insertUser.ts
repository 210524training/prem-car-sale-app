import AWS from 'aws-sdk';

const docClient = new AWS.DynamoDB.DocumentClient( {
  region: 'us-east-1',
  endpoint: 'https://dynamodb.us-east-1.amazonaws.com',
  apiVersion: 'latest'
});

interface User {
  username: string;
  password: string;
  role: 'Customer' | 'Employee';
}

async function addUser(item: User) {
	const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
		TableName: 'users',
		Item: item
	};

  try{
    const result = await docClient.put(params).promise();
    
    console.log(result);
    return true;
  } catch(error) {
    console.log(error);
    return false;
  }
}