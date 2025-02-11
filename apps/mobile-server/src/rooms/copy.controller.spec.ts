import { Test, TestingModule } from '@nestjs/testing';
import { CopyController } from './copy.controller';
import { getRoom } from './room.util';
import { SessionData } from '../@types/session-data';

// Mock the room.util module
jest.mock('./room.util', () => ({
  getRoom: jest.fn(),
}));

// Define a mock session
const mockSession: SessionData = {
  userId: 'test-user',
  email: 'test@example.com',
  identityId: 'test-identity-id',
  awsCredentials: JSON.stringify({
    accessKeyId: 'test-access-key',
    secretAccessKey: 'test-secret-key',
    sessionToken: 'test-session-token',
  }),
  identityToken: 'test-identity-token',
  accessToken: 'test-access-token',
};

const mockDiory = {
  id: 'mock-diory-id',
  links: [],
  data: [{ contentUrl: 'test-content-url' }],
  image: 'test-image-url',
};

const mockRoom = {
  id: 'mock-room',
  diograph: {
    getDiory: jest.fn().mockReturnValue(mockDiory),
    addDioryAndLink: jest.fn(),
  },
  readContent: jest.fn().mockResolvedValue(Buffer.from('mock-content')),
  addContent: jest.fn(),
  saveRoom: jest.fn().mockResolvedValue(true),
};

// Define the payload for the copyDiory action
const payload = {
  sourceRoomId: 'source-room-id',
  copyDioryId: 'copy-diory-id',
  destinationRoomId: 'destination-room-id',
  parentDioryId: 'parent-diory-id',
};

describe('CopyController', () => {
  let controller: CopyController;

  beforeAll(() => {
    (getRoom as jest.Mock).mockImplementation(async () => mockRoom);
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CopyController],
    }).compile();

    controller = module.get<CopyController>(CopyController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should copy diory successfully', async () => {
    const result = await controller.copyDiory(mockSession, payload);

    expect(getRoom).toHaveBeenCalledTimes(2);
    expect(getRoom).toHaveBeenNthCalledWith(1, 'source-room-id', mockSession);
    expect(getRoom).toHaveBeenNthCalledWith(
      2,
      'destination-room-id',
      mockSession,
    );

    expect(mockRoom.diograph.getDiory).toHaveBeenCalledWith({
      id: 'copy-diory-id',
    });
    expect(mockRoom.diograph.getDiory).toHaveBeenCalledWith({
      id: 'parent-diory-id',
    });

    expect(mockDiory.links).toEqual([]);

    expect(mockRoom.diograph.addDioryAndLink).toHaveBeenCalledWith(
      mockDiory,
      mockDiory,
    );

    expect(mockRoom.readContent).toHaveBeenCalledWith('test-content-url');
    expect(mockRoom.addContent).toHaveBeenCalledWith(
      Buffer.from('mock-content'),
      'test-content-url',
    );
    expect(mockRoom.saveRoom).toHaveBeenCalled();

    expect(result).toEqual({
      message: 'Diory copied successfully',
      dioryId: 'mock-diory-id',
      parentDioryId: 'mock-diory-id',
    });
  });
});
