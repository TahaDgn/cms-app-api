import { ResponseDto } from 'libs/interfaces';
import { ListProjectsResponsePayload } from '../list-project/list-projects.response.dto';

export class AddClientToProjectResponseDto
  implements ResponseDto<ListProjectsResponsePayload[]>
{
  success: boolean;
  message?: string;
  data?: ListProjectsResponsePayload[];
}
