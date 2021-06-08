import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import log from '../log';
import User from '../models/user';
import docClient from '../services/connection/dataConnection';

export class UserDAO {
  constructor(
    private dynamo = docClient,
  ) {}

  async addUser(item: User): Promise<boolean> {
    const param: DocumentClient.PutItemInput = {
      TableName: 'users',
      Item: item,
    };
    try {
      const result = await this.dynamo.put(param).promise();
      log.debug(result);
      return true;
    } catch(error) {
      return false;
    }
  }

  async findByUsername(username: string): Promise<User | undefined> {
    const param: DocumentClient.GetItemInput = {
      TableName: 'users',
      Key: {
        username,
      },
      ProjectionExpression: '#user, #pass, #r',
      ExpressionAttributeNames: {
        '#user': 'username',
        '#pass': 'password',
        '#r': 'role',
      },
    };
    const data = await this.dynamo.get(param).promise();
    log.debug(data);
    const newUser = new User(
      data.Item?.username, data.Item?.password, data.Item?.role,
    );
    return newUser;
  }
}

export default new UserDAO();
