import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/common/entities/user.entity";
import { Status } from "src/common/types/status.type";

export class UpdateEventDto{
        @ApiProperty({ example: 'HackerTon Event' })
        title: string;
    
        @ApiProperty({ example: 'An event where developer meet and challenge each other with projects' })
        description: string;
    
        @ApiProperty({ example: Date.now() })
        date: Date;
    
        @ApiProperty({ example: 'Address/Location of where the event will be held' })
        location: string;
    
        @ApiProperty({ example: 1500 })
        price: number;
    
        @ApiProperty({ example: 230 })
        capacity: number;
    
        @ApiProperty({ example: { id: 3 } })
        createdBy: User;
    
        @ApiProperty({ example: { id: 3 } })
        organizer: User;

        
            @ApiProperty({ example: Status.ACTIVE })
            status: Status;
}