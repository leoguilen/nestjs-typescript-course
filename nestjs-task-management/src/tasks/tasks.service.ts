import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { TaskStatus } from './task-status.enum';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly tasksRepository: Repository<Task>,
  ) {}

  async getTasks(
    { status, search }: GetTasksFilterDto,
    user: User,
  ): Promise<Task[]> {
    const query = this.tasksRepository.createQueryBuilder('task');
    query.where({ user });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();
    return tasks;
  }

  async getTaskById(taskId: string, user: User): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id: taskId, user },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID "${taskId}" not found.`);
    }

    return task;
  }

  async createTask(
    { title, description }: CreateTaskDto,
    user: User,
  ): Promise<Task> {
    const task = this.tasksRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    await this.tasksRepository.save(task);
    return task;
  }

  async deleteTask(taskId: string, user: User): Promise<void> {
    const result = await this.tasksRepository.delete({ id: taskId, user });

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${taskId}" not found.`);
    }
  }

  async updateTaskStatus(
    taskId: string,
    newStatus: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task: Task = await this.getTaskById(taskId, user);

    task.status = newStatus;
    await this.tasksRepository.save(task);

    return task;
  }
}
