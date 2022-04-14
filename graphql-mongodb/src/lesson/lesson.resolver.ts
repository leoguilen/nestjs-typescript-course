import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { LessonType } from './lesson.type';
import { LessonService } from './lesson.service';
import { Lesson } from './lesson.entity';
import { CreateLessonInput } from './lesson.input';
import { AssingStudentsToLessonInput } from './assing-students-to-lesson.input';
import { StudentService } from 'src/student/student.service';
import { Student } from 'src/student/student.entity';

@Resolver((_of) => LessonType)
export class LessonResolver {
  constructor(
    private readonly lessonService: LessonService,
    private readonly studentService: StudentService,
  ) {}

  @Query((_returns) => [LessonType])
  async getLessons(): Promise<Lesson[]> {
    return await this.lessonService.getLessons();
  }

  @Query((_returns) => LessonType)
  async getLesson(@Args('id') lessonId: string): Promise<Lesson> {
    return await this.lessonService.getLessonById(lessonId);
  }

  @Mutation((_returns) => LessonType)
  async createLesson(
    @Args('createLessonInput') createLessonInput: CreateLessonInput,
  ): Promise<Lesson> {
    return await this.lessonService.createLesson(createLessonInput);
  }

  @Mutation((_returns) => LessonType)
  async assingStudentsToLesson(
    @Args('assingStudentsToLessonInput')
    { lessonId, studentIds }: AssingStudentsToLessonInput,
  ): Promise<Lesson> {
    return await this.lessonService.assignStudentsToLesson(
      lessonId,
      studentIds,
    );
  }

  @ResolveField()
  async students(@Parent() lesson: Lesson): Promise<Student[]> {
    return await this.studentService.getManyStudents(lesson.students);
  }
}
