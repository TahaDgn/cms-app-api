import { Module } from '@nestjs/common';
import { EventDefinitionsService } from './event-definitions.service';

@Module({
  providers: [EventDefinitionsService],
  exports: [EventDefinitionsService],
})
export class EventDefinitionsModule {}
