import AWS from 'aws-sdk';

const docClient = new AWS.DynamoDB.DocumentClient( {
  region: 'us-east-1',
  endpoint: 'https://dynamodb.us-east-1.amazonaws.com',
  apiVersion: 'latest'
});

interface Car {
  id: number,
  make: string,
  model: string,
  color: string,
  year: number,
  mileage: number,
  price: number,
  status: string,
}

async function addCar(item: Car) {
	const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
		TableName: 'cars',
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
