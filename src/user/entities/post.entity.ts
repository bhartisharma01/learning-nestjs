import { Column, Entity, IntegerType, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Post{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    title:string

    @Column()
    description:string
    

    @ManyToOne(()=>User, (user)=>user.posts)
    @JoinColumn()
    user:User

}