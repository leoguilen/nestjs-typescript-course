import { Field, InputType, ID } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class AssingStudentsToLessonInput {
  @IsUUID()
  @Field((_type) => ID)
  lessonId: string;

  @IsUUID('all', { each: true })
  @Field((_type) => [String])
  studentIds: string[];
}
