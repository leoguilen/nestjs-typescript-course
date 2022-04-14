import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Student } from './student.entity';
import { StudentService } from './student.service';
import { StudentType } from './student.type';
import { CreateStudentInput } from './create-student.input';

@Resolver((_of) => StudentType)
export class StudentResolver {
  constructor(private readonly studentService: StudentService) {}

  @Query((returns) => [StudentType])
  async getStudents(): Promise<Student[]> {
    return await this.studentService.getStudents();
  }

  @Query((returns) => StudentType)
  async getStudent(@Args('id') id: string): Promise<Student> {
    return await this.studentService.getStudentById(id);
  }

  @Mutation((returns) => StudentType)
  async createStudent(
    @Args('createStudentInput') createStudentInput: CreateStudentInput,
  ): Promise<Student> {
    return await this.studentService.createStudent(createStudentInput);
  }
}
