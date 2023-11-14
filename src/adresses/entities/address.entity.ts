import { Address } from '@prisma/client';

export class AddressEntity implements Address {
  id: string;
  cep: string;
  state: string;
  city: string;
  district: string;
  street: string;
  number: string;
  complement: string;
  property_id: string;
}
