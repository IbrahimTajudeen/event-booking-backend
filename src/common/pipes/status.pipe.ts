import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { Status } from "../types/status.type";

@Injectable()
export class StatusPipe implements PipeTransform<string, Status> {
    private readonly allowedStatuses = ['active', 'inactive', 'cancelled'];

    transform(value: string, metadata: ArgumentMetadata): Status {
        if (!this.allowedStatuses.includes(value.toLowerCase())) {
            throw new BadRequestException(`Status must be one of the following: ${this.allowedStatuses.join(', ')}`);
        }
        return value as Status;
    }
}
