import { Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lesson } from './lesson.entity';
import { v4 as uuid } from 'uuid';
import { CreateLessonInput } from './lesson.input';

@Injectable({ scope: Scope.REQUEST })
export class LessonService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
  ) {}

  async getLessons(): Promise<Lesson[]> {
    return await this.lessonRepository.find({});
  }

  async getLessonById(lessonId: string): Promise<Lesson> {
    return await this.lessonRepository.findOne({
      where: { id: lessonId },
    });
  }

  async createLesson({
    name,
    startDate,
    endDate,
    students,
  }: CreateLessonInput): Promise<Lesson> {
    const lesson: Lesson = this.lessonRepository.create({
      id: uuid(),
      name,
      startDate,
      endDate,
      students,
    });

    return await this.lessonRepository.save(lesson);
  }

  async assignStudentsToLesson(
    lessonId: string,
    studentIds: string[],
  ): Promise<Lesson> {
    const lesson: Lesson = await this.lessonRepository.findOne({
      where: { id: lessonId },
    });
    lesson.students = [...lesson.students, ...studentIds];

    return this.lessonRepository.save(lesson);
  }
}
