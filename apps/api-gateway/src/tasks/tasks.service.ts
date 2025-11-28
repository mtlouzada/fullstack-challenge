import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class TasksService {
  private readonly TASKS_SERVICE_URL = 'http://localhost:3002/tasks'; 
  // ajuste se sua porta do task-service for diferente

  async createTask(data: any) {
    try {
      const response = await axios.post(`${this.TASKS_SERVICE_URL}`, data);
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Erro ao criar tarefa no task-service',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    try {
      const response = await axios.get(`${this.TASKS_SERVICE_URL}`);
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Erro ao buscar tarefas no task-service',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number) {
    try {
      const response = await axios.get(`${this.TASKS_SERVICE_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Erro ao buscar tarefa no task-service',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: number, data: any) {
    try {
      const response = await axios.patch(`${this.TASKS_SERVICE_URL}/${id}`, data);
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Erro ao atualizar tarefa no task-service',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete(id: number) {
    try {
      const response = await axios.delete(`${this.TASKS_SERVICE_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Erro ao deletar tarefa no task-service',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
