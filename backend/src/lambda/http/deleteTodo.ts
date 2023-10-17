import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'
import { deleteTodo } from '../../businessLogic/todos'
import { getUserId } from '../utils'

const logger = createLogger('createTodoHandler')
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const todoId = event.pathParameters.todoId

      console.log("Processing Event ", event);
      const userId = getUserId(event);

      await deleteTodo(userId, todoId)

      return {
        statusCode: 200,
        body: JSON.stringify({})
      }
    } catch (error) {
      logger.error(`Error updating Todo item: ${error.message}`)
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Could not update Todo item'
        })
      }
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )