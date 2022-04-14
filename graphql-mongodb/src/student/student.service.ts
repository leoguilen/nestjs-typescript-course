import { Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './student.entity';
import { MongoRepository, Repository } from 'typeorm';
import { CreateStudentInput } from './create-student.input';
import { v4 as uuid } from 'uuid';

@Injectable({ scope: Scope.REQUEST })
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: MongoRepository<Student>,
  ) {}

  async getStudents(): Promise<Student[]> {
    return await this.studentRepository.find({});
  }

  async getStudentById(studentId: string): Promise<Student> {
    return await this.studentRepository.findOne({ where: { id: studentId } });
  }

  async getManyStudents(studentIds: string[]): Promise<Student[]> {
    return await this.studentRepository.findBy({
      where: {
        id: {
          $in: studentIds,
        },
      },
    });
  }

  async createStudent({
    firstName,
    lastName,
  }: CreateStudentInput): Promise<Student> {
    const student: Student = this.studentRepository.create({
      id: uuid(),
      firstName,
      lastName,
    });

    return await this.studentRepository.save(student);
  }
}
