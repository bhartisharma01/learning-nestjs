import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Profile{

    @Column()
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    contactno:string

    @Column()
    dob:string

    @Column({ type: 'varchar', nullable: true, default: '' })
    profilePic:string

   

}