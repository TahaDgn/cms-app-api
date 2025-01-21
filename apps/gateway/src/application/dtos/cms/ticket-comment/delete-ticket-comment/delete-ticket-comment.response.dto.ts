import { ResponseDto } from 'libs/interfaces';
import { GetTicketResponsePayload } from '../../ticket';

export class DeleteTicketCommentResponseDto
  implements ResponseDto<GetTicketResponsePayload>
{
  success: boolean;

  message?: string;

  data?: GetTicketResponsePayload;
}
