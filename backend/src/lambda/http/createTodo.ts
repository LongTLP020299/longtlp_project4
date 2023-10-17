import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createTodo } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils'

const logger = createLogger('createTodoHandler')
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const newTodo: CreateTodoRequest = JSON.parse(event.body);
      // TODO: Implement creating a new TODO item
      const userId = getUserId(event);
      const createdTodo = await createTodo(newTodo, userId)

      return {
        statusCode: 201,
        body: JSON.stringify({
          item: createdTodo
        })
      }
    } catch (error) {
      logger.error(`Error creating Todo item: ${error.message}`)
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Could not create Todo item'
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