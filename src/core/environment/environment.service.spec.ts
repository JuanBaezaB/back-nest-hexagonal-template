import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { EnvironmentService } from './environment.service';

describe('EnvironmentService', () => {
  let service: EnvironmentService;

  const mockConfigService = {
    getOrThrow: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnvironmentService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();
    service = module.get<EnvironmentService>(EnvironmentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get', () => {
    const mockKey = 'ENVIRONMENT';
    const mockValue = 'development';
    it('should return the value for the given key', () => {
      mockConfigService.getOrThrow.mockReturnValue(mockValue);
      const result = service.get(mockKey);
      expect(result).toBe(mockValue);
    });

    it('calls getOrThrow with the correct key', () => {
      mockConfigService.getOrThrow.mockReturnValue(mockValue);
      service.get(mockKey);
      expect(mockConfigService.getOrThrow).toHaveBeenCalledWith(mockKey);
    });
  });

  describe('isProd', () => {
    it('should return true if ENVIRONMENT is production', () => {
      mockConfigService.getOrThrow.mockReturnValue('production');
      const result = service.isProd();
      expect(result).toBe(true);
    });

    it('should return false if ENVIRONMENT is not production', () => {
      mockConfigService.getOrThrow.mockReturnValue('development');
      const result = service.isProd();
      expect(result).toBe(false);
    });

    it('calls getOrThrow with the correct key', () => {
      mockConfigService.getOrThrow.mockReturnValue('production');
      service.isProd();
      expect(mockConfigService.getOrThrow).toHaveBeenCalledWith('ENVIRONMENT');
    });
  });

  describe('isDev', () => {
    it('should return true if ENVIRONMENT is development', () => {
      mockConfigService.getOrThrow.mockReturnValue('development');
      const result = service.isDev();
      expect(result).toBe(true);
    });

    it('should return false if ENVIRONMENT is not development', () => {
      mockConfigService.getOrThrow.mockReturnValue('production');
      const result = service.isDev();
      expect(result).toBe(false);
    });

    it('calls getOrThrow with the correct key', () => {
      mockConfigService.getOrThrow.mockReturnValue('development');
      service.isDev();
      expect(mockConfigService.getOrThrow).toHaveBeenCalledWith('ENVIRONMENT');
    });
  });
});
