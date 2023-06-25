import { Test, TestingModule } from '@nestjs/testing';
import { SlackBootService } from './slack-boot.service';

describe('SlackBootService', () => {
  let service: SlackBootService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SlackBootService],
    }).compile();

    service = module.get<SlackBootService>(SlackBootService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
