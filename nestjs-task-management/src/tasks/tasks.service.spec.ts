import { TasksService } from './tasks.service';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { Test } from '@nestjs/testing';

const mockTasksRepository = () => ({

});

describe('TasksService', () => {
  let tasksService: TasksService;
  let tasksRepository: Repository<Task>;

  beforeEach(async () => {
      const module = await Test.createTestingModule({
          providers: [
              TasksService,
              { provide: Repository<Task>, useFactory: mockTasksRepository }
          ]
      })
  })
});
