import { ApiProperty } from '@nestjs/swagger';

export class PermissionDto {
  @ApiProperty()
  isAdmin!: boolean;

  @ApiProperty({ required: false })
  role?: string;

  constructor(params: Partial<PermissionDto>) {
    Object.assign(this, params);
  }
}
