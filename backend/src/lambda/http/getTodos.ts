import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'
import { getTodosForUser as getTodosForUser } from '../../businessLogic/todos'
import { getUserId } from '../utils';

const logger = createLogger('createTodoHandler')
// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    try {
      const userId = getUserId(event);
      const todos = await getTodosForUser(userId)
      return {
        statusCode: 200,
        body: JSON.stringify({
          items: todos
        })
      }
    } catch (error) {
      logger.error(`Error to get list: ${error.message}`)
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Can not get list!'
        })
      }
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)