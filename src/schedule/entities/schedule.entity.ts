import { User } from 'src/auth/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'schedule' })
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { array: true })
  schedulesHours: string[];

  @Column('text', { array: true })
  workdays: string[];

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
