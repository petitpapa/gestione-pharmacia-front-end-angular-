import {BaseModel} from './base-model';
import { CustomerCategory } from './customer.category';

export interface Customer {
  customerId?: number;
  category: CustomerCategory;
  name?: string;
  birthday?: string;
  birthPlace?: string;
  registrationNumber?: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  photo?: string[];
  hasLoyaltyCard?: boolean;
  crypted?: boolean;
}

export interface CustomerResponse extends BaseModel{
  customers: Customer[];
}
