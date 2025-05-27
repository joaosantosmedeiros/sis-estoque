import { ReturnAccountDto } from './return-account.dto';

export interface ReturnLoginDto {
  account: ReturnAccountDto;
  accessToken: string;
}
