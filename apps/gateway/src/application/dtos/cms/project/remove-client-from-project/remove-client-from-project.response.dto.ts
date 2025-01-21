import { ResponseDto } from 'libs/interfaces';
import { ListProjectsResponsePayload } from '../list-project/list-projects.response.dto';

export class RemoveClientsFromProjectResponseDto
  implements ResponseDto<ListProjectsResponsePayload[]>
{
  success: boolean;
  message?: string;
  data?: ListProjectsResponsePayload[];
}
