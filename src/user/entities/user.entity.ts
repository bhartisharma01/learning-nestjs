import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Profile } from "./profile.entity";
import { Post } from "./post.entity";


@Entity()
export class User{

  @PrimaryGeneratedColumn({type:'bigint'})
  id: number;
  
  @Column({ type: 'varchar', length: 30 })
  name: string;

  @Column({ type: 'varchar', length: 15, unique:true  })
  username: string;

  @Column({ type: 'varchar', length: 40, unique:true })
  email: string;

  @Column({ type: 'int' })
  age: number;

  @Column({ type: 'varchar' })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

 
  @OneToOne(()=>Profile)
  @JoinColumn()
  profile:Profile


  @OneToMany(()=> Post, (post)=>post.user)
  @JoinColumn()
  posts:Post[]
//   @DeleteDateColumn({ nullable: true })
//   deletedAt: Date | null;

//   @Column({ type: 'enum', enum: ['m', 'f', 'u'] })
//   /**
//    * m - male
//    * f - female
//    * u - unspecified
//    */
//   gender: string;

}