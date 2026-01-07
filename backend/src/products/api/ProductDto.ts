import { ApiProperty } from '@nestjs/swagger';

export class ProductDto {
  @ApiProperty({ example: 'Rengoku', required: true })
  name: string;

  @ApiProperty({ example: 'Flame Hashira', required: true })
  category: string;

  @ApiProperty({
    default:
      '/api/file?path=config/products/hashiras/rengoku.jpg&type=image/jpg',
    required: true
  })
  photoUrl: string;

  @ApiProperty({ example: 'The Flame Hashira, master of flame breathing techniques', required: true })
  description: string;

  @ApiProperty({ example: 1, required: true })
  viewsCount: number;

  constructor(params: {
    name: string;
    category: string;
    photoUrl: string;
    description: string;
    viewsCount: number;
  }) {
    Object.assign(this, params);
  }
}
