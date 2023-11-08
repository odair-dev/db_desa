import { $Enums, Property } from '@prisma/client';

export class PropertyEntity implements Property {
  id: string;
  name: string;
  size: number;
  available: boolean;
  category: $Enums.Category_Property;
}
