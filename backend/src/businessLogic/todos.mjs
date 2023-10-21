import { createLogger } from '../utils/logger.mjs';
import { TodosAccess } from '../dataLayer/todos.mjs';
import { uuid } from 'uuidv4';
import { AttachmentUtils } from '../fileStorage/attachmentUtils.mjs';

const logger = createLogger('businessLogic');

const todosAccess = new TodosAccess();
const attachmentUtils = new AttachmentUtils();

export async function getTodos(userId) {
    return todosAccess.getTodos(userId);
}

export async function createTodo(newTodo, userId) {
    logger.info('CreateTodo function');

    const todoId = uuid();
    const createdAt = new Date().toISOString();
    const attachmentUrl = attachmentUtils.buildAttachmentUrl(todoId);
    const newItem = {
        userId,
        todoId,
        createdAt,
        done: false,
        attachmentUrl: attachmentUrl,
        ...newTodo
    };

    return await todosAccess.createTodo(newItem);
}

export async function updateTodo(userId, todoId, todoUpdate) {
    return await todosAccess.updateTodo(userId, todoId, todoUpdate);
}

export async function deleteTodo(todoId, userId) {
    return await todosAccess.deleteTodo(todoId, userId);
}

export async function createAttachmentPresignedUrl(todoId) {
    return await attachmentUtils.getUploadUrl(todoId);
}