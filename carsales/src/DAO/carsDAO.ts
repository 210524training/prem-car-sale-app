import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import log from '../log';
import Car from '../models/car';
import docClient from '../services/connection/dataConnection';

export class CarDAO {
  constructor(
    private dynamo = docClient,
  ) {}

  async getById(id: string): Promise<Car | undefined> {
    const param: DocumentClient.GetItemInput = {
      TableName: 'cars',
      Key: {
        id,
      },
      ProjectionExpression: 'id, make, model, color, year, mileage, price, owner',
    };
    const result = await this.dynamo.get(param).promise();
    log.debug(result);
    return result.Item as Car;
  }

  async getByOwner(user: string): Promise<Car[]> {
    const param: DocumentClient.ScanInput = {
      TableName: 'cars',
      ProjectionExpression: '#i, #m, #mo, #c, #y, #mi, #p, #o',
      FilterExpression: '#o = :owner',
      ExpressionAttributeValues: {
        ':owner': user,
      },
      ExpressionAttributeNames: {
        '#i': 'id',
        '#m': 'make',
        '#mo': 'model',
        '#c': 'color',
        '#y': 'year',
        '#mi': 'mileage',
        '#p': 'price',
        '#o': 'owner',
      },
    };
    try {
      const data = await this.dynamo.scan(param).promise();
      if(data.Items) {
        return data.Items as Car[];
      }
    } catch(error) {
      log.error(error);
    }
    return [];
  }

  async updateOwner(owner: string, id: number): Promise<void> {
    const param: DocumentClient.UpdateItemInput = {
      TableName: 'cars',
      Key: {
        id,
      },
      UpdateExpression: 'SET #o = :o',
      ExpressionAttributeNames: {
        '#o': 'owner',
      },
      ExpressionAttributeValues: {
        ':o': owner,
      },
    };
    await this.dynamo.update(param).promise();
  }

  async addCar(item: Car): Promise<boolean> {
    const param: DocumentClient.PutItemInput = {
      TableName: 'cars',
      Item: item,
      ReturnConsumedCapacity: 'TOTAL',
      ConditionExpression: 'id <> :id',
      ExpressionAttributeValues: {
        ':id': item.id,
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

  async removeCar(id: number): Promise<boolean> {
    const param: DocumentClient.DeleteItemInput = {
      TableName: 'cars',
      Key: {
        id,
      },
    };
    try {
      const result = await this.dynamo.delete(param).promise();
      log.debug(result);
      return true;
    } catch(error) {
      log.error('Error while removing car.');
      return false;
    }
  }

  async viewAll(): Promise<Car[]> {
    const param: DocumentClient.ScanInput = {
      TableName: 'cars',
      ProjectionExpression: '#i, #m, #mo, #c, #y, #mi, #p, #o',
      FilterExpression: '#o = :owner',
      ExpressionAttributeValues: {
        ':owner': 'On Sale',
      },
      ExpressionAttributeNames: {
        '#i': 'id',
        '#m': 'make',
        '#mo': 'model',
        '#c': 'color',
        '#y': 'year',
        '#mi': 'mileage',
        '#p': 'price',
        '#o': 'owner',
      },
    };
    const result = await this.dynamo.scan(param).promise();
    log.debug(result);
    if(result.Items) {
      return result.Items as Car[];
    }
    return [];
  }
}

export default new CarDAO();
