import {Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable} from "typeorm";
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
    @JoinTable()
    follows: User[]

}
