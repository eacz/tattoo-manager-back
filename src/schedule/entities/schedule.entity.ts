import { User } from 'src/auth/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'schedule' })
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('simple-array', { array: true })
  schedulesHours: string[];

  @Column('simple-array', { array: true })
  workdays: string[];

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
