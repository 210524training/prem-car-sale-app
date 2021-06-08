import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import log from '../log';
import Offer from '../models/offer';
import docClient from '../services/connection/dataConnection';

export class OfferDAO {
  constructor(
    private dynamo = docClient,
  ) {}

  async newOffer(item: Offer): Promise<boolean> {
    const param: DocumentClient.PutItemInput = {
      TableName: 'offers',
      Item: item,
      ReturnConsumedCapacity: 'TOTAL',
      ConditionExpression: 'carId <> :carId',
      ExpressionAttributeValues: {
        ':carId': item.carId,
      },
    };
    try {
      const result = await this.dynamo.put(param).promise();
      log.debug(result);
      return true;
    } catch(error) {
      return false;
    }
  }

  async removeOffer(carId: number): Promise<boolean> {
    const param: DocumentClient.DeleteItemInput = {
      TableName: 'offers',
      Key: {
        carId,
      },
    };
    try {
      const result = await this.dynamo.delete(param).promise();
      log.debug(result);
      return true;
    } catch(error) {
      log.error('Error while removing offer.');
      return false;
    }
  }

  async retrievePendingOffer(): Promise<Offer[]> {
    const param: DocumentClient.ScanInput = {
      TableName: 'offers',
      ProjectionExpression: '#c, #ci, #u, #r, #mon, #of',
      FilterExpression: '#of = :offerStatus',
      ExpressionAttributeValues: {
        ':offerStatus': 'Reviewing',
      },
      ExpressionAttributeNames: {
        '#c': 'carOffer',
        '#ci': 'carId',
        '#u': 'username',
        '#r': 'remainingPay',
        '#mon': 'monthlyPay',
        '#of': 'offerStatus',
      },
    };
    const result = await this.dynamo.scan(param).promise();
    if(result.Items) {
      return result.Items as Offer[];
    }
    return [];
  }

  async updateAccept(carId: number): Promise<void> {
    const param: DocumentClient.UpdateItemInput = {
      TableName: 'offers',
      Key: {
        carId,
      },
      UpdateExpression: 'SET offerStatus = :oS',
      ExpressionAttributeValues: {
        ':oS': 'Accepted',
      },
      ReturnValues: 'UPDATED_NEW',
    };
    await this.dynamo.update(param).promise();
  }

  async updateReject(carId: number): Promise<void> {
    const param: DocumentClient.UpdateItemInput = {
      TableName: 'offers',
      Key: {
        carId,
      },
      UpdateExpression: 'SET offerStatus = :oS',
      ExpressionAttributeValues: {
        ':oS': 'Rejected',
      },
      ReturnValues: 'UPDATED_NEW',
    };
    await this.dynamo.update(param).promise();
  }

  async scanPendingOffers(carId: number): Promise<Offer[]> {
    const param: DocumentClient.ScanInput = {
      TableName: 'offers',
      FilterExpression: '#oS = :rev AND #cI = :cI',
      ExpressionAttributeNames: {
        '#oS': 'offerStatus',
        '#cI': 'carId',
      },
      ExpressionAttributeValues: {
        ':cI': carId,
        ':rev': 'Reviewing',
      },
    };
    const result = await this.dynamo.scan(param).promise();
    if(result.Items) {
      return result.Items as Offer[];
    }
    return [];
  }

  async queryCars(user: string): Promise<Offer[]> {
    const param: DocumentClient.ScanInput = {
      TableName: 'offers',
      FilterExpression: '#u = :us AND #oS = :oST',
      ExpressionAttributeNames: {
        '#u': 'username',
        '#oS': 'offerStatus',
      },
      ExpressionAttributeValues: {
        ':us': user,
        ':oST': 'Accepted',
      },
    };
    const result = await this.dynamo.scan(param).promise();
    if(result.Items) {
      return result.Items as Offer[];
    }
    return [];
  }

  async queryAllCars(): Promise<Offer[]> {
    const param: DocumentClient.ScanInput = {
      TableName: 'offers',
      FilterExpression: '#oS = :oST',
      ExpressionAttributeNames: {
        '#oS': 'offerStatus',
      },
      ExpressionAttributeValues: {
        ':oST': 'Accepted',
      },
    };
    const result = await this.dynamo.scan(param).promise();
    if(result.Items) {
      return result.Items as Offer[];
    }
    return [];
  }
}

export default new OfferDAO();
