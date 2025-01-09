import { ResponseDto } from 'libs/interfaces';
import { GetTicketCommentResponsePayload } from '../get-ticket-comment/get-ticket-comment.response.dto';

export class CreateTicketCommentResponseDto
  implements ResponseDto<GetTicketCommentResponsePayload>
{
  success: boolean;

  message?: string;

  data?: GetTicketCommentResponsePayload;
}
