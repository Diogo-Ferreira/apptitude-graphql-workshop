import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable
} from "typeorm";
import { Post } from "./Post";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  bio: string;

  @Column()
  age: number;

  @OneToMany(type => Post, post => post.author)
  posts: Post[];

  @ManyToMany(type => User, follower => follower.follows)
  followers: User[];

  @ManyToMany(type => User, followed => followed.followers)
  @JoinTable()
  follows: User[];

  @ManyToMany(type => Post, post => post.likes)
  likes: Post[];
}
