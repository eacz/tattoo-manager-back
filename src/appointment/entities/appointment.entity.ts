import { User } from 'src/auth/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Status {
  pending = 'pending',
  finished = 'finished',
  cancelled = 'cancelled',
}

@Entity({ name: 'appointment' })
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  dateStart: Date;

  @CreateDateColumn()
  dateEnd: Date;

  @Column()
  title: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.pending,
  })
  status: Status;

  @Column({ type: 'float' })
  price: number;

  @Column({ type: 'float', nullable: true })
  earnestMoney?: number;

  @Column({ nullable: true })
  notes?: string;

  @ManyToOne(() => User, (user) => user.appointments)
  user: User;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updatedAt: Date;
}
