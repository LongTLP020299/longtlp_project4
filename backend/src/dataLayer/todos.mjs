import AWS from 'aws-sdk';
import AWSXRay from 'aws-xray-sdk';

const XAWS = AWSXRay.captureAWS(AWS);
const docClient = new XAWS.DynamoDB.DocumentClient();
const todosTable = process.env.TODOS_TABLE;
const todosIndex = process.env.TODOS_CREATED_AT_INDEX;

export class TodosAccess {
    async getTodos(userId) {
        const result = await docClient
            .query({
                TableName: todosTable,
                IndexName: todosIndex,
                KeyConditionExpression: 'userId = :userId',
                ExpressionAttributeValues: {
                    ':userId': userId
                }
            })
            .promise();

        return result.Items;
    }

    async createTodo(newItem) {
        const result = await docClient.put({
            TableName: todosTable,
            Item: newItem
        }).promise();
        return newItem;
    }

    async updateTodo(userId, todoId, updateItem) {
        await docClient
          .update({
            TableName: todosTable,
            Key: {
              todoId,
              userId
            },
            UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
            ExpressionAttributeValues: {
              ':name': updateItem.name,
              ':dueDate': updateItem.dueDate,
              ':done': updateItem.done
            },
            ExpressionAttributeNames: {
              '#name': 'name'
            },
            ReturnValues: 'UPDATED_NEW'
          })
          .promise();
    
        return updateItem;
      }
    
      async deleteTodo(todoId, userId) {
        const result = await docClient
          .delete({
            TableName: todosTable,
            Key: {
              todoId,
              userId
            }
          })
          .promise();
        return result;
      }
    
      async updateTodoAttachmentUrl(todoId, userId, attachmentUrl) {
        await docClient
          .update({
            TableName: todosTable,
            Key: {
              todoId,
              userId
            },
            UpdateExpression: 'set attachmentUrl = :attachmentUrl',
            ExpressionAttributeValues: {
              ':attachmentUrl': attachmentUrl
            }
          })
          .promise();
      }
}