import AWS from 'aws-sdk';

const docClient = new AWS.DynamoDB.DocumentClient( {
  region: 'us-east-1',
  endpoint: 'https://dynamodb.us-east-1.amazonaws.com',
  apiVersion: 'latest'
});

interface Offer {
  carOffer: number,
  carId: number,
  username: string,
  remainingPay: number,
  monthlyPay: number,
  offerStatus: 'Reviewing' | 'Accepted' | 'Rejected',
}

async function newOffer(item: Offer) {
	const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
		TableName: 'offers',
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