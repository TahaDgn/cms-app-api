import { ResponseDto } from 'libs/interfaces';
import { GetTicketResponsePayload } from '../get-ticket/get-ticket.response.dto';

export class DeleteTicketResponseDto
  implements ResponseDto<GetTicketResponsePayload>
{
  success: boolean;

  message?: string;

  data?: GetTicketResponsePayload;
}
