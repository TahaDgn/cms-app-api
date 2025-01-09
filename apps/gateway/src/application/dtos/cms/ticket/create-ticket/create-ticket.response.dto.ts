import { ResponseDto } from 'libs/interfaces';
import { GetTicketResponsePayload } from '../get-ticket/get-ticket.response.dto';

export class CreateTicketResponseDto
  implements ResponseDto<GetTicketResponsePayload>
{
  success: boolean;

  message?: string;

  data?: GetTicketResponsePayload;
}
