import { Expose } from 'class-transformer';

export class TaskResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  createdAt: Date;
}
