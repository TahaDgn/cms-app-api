import { ResponseDto } from 'libs/interfaces';
import { GetProjectResponsePayload } from '../get-project/get-project.response.dto';

export class UpdateProjectResponseDto
  implements ResponseDto<GetProjectResponsePayload>
{
  success: boolean;

  message?: string;

  data?: GetProjectResponsePayload;
}
