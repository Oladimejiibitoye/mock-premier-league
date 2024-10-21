import 'reflect-metadata';
import { fixtureService } from '../modules/fixture/fixture.services';
import { Team } from '../models/team';
import { Fixture } from '../models/fixture';
import { BadRequestError, NotFoundError } from '../utils/errors';
import { CreateFixtureDto, UpdateFixtureDto, FixtureSearchDto, SortOrder } from '../modules/fixture/fixture.dto';

jest.mock('../src/models/team');
jest.mock('../src/models/fixture');
jest.mock('reflect-metadata');

describe('FixtureService', () => {
  describe('createFixture', () => {
    it('should create a fixture successfully', async () => {
      const fixtureDto: CreateFixtureDto = {
        homeTeam: 'Home Team',
        awayTeam: 'Away Team',
        date: new Date('2024-12-01T10:00:00Z'),
        location: 'location'
      };

      const homeTeamMock = { _id: 'homeTeamId', name: 'Home Team' };
      const awayTeamMock = { _id: 'awayTeamId', name: 'Away Team' };

      // Mock Team.findOne to return home and away teams
      (Team.findOne as jest.Mock)
        .mockResolvedValueOnce(homeTeamMock)
        .mockResolvedValueOnce(awayTeamMock);

      // Mock Fixture.findOne to return null (no existing fixture)
      (Fixture.findOne as jest.Mock).mockResolvedValue(null);

      // Mock Fixture.save to simulate fixture creation
      const saveMock = jest.fn().mockResolvedValue({
        _id: 'fixtureId',
        homeTeam: 'homeTeamId',
        awayTeam: 'awayTeamId',
        date: '2024-12-01T10:00:00Z',
        uniqueLink: 'fixture/fixtureId'
      });
      (Fixture as any).mockImplementation(() => ({ save: saveMock }));

      const result = await fixtureService.createFixture(fixtureDto);

      expect(Team.findOne).toHaveBeenCalledTimes(2);
      expect(Fixture.findOne).toHaveBeenCalledTimes(1);
      expect(saveMock).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        fixture: {
          _id: 'fixtureId',
          homeTeam: 'homeTeamId',
          awayTeam: 'awayTeamId',
          date: '2024-12-01T10:00:00Z',
          uniqueLink: 'fixture/fixtureId',
        },
        message: 'Fixture created successfully',
      });
    });

    it('should throw NotFoundError if home team is not found', async () => {
      const fixtureDto: CreateFixtureDto = {
        homeTeam: 'Nonexistent Home Team',
        awayTeam: 'Away Team',
        date: new Date('2024-12-01T10:00:00Z'),
        location: 'location'
      };

      // Mock Team.findOne to return null (home team not found)
      (Team.findOne as jest.Mock).mockResolvedValue(null);

      await expect(fixtureService.createFixture(fixtureDto)).rejects.toThrow(NotFoundError);
    });

    it('should throw BadRequestError if fixture already exists', async () => {
      const fixtureDto: CreateFixtureDto = {
        homeTeam: 'Home Team',
        awayTeam: 'Away Team',
        date: new Date('2024-12-01T10:00:00Z'),
        location: 'location'
      };

      const homeTeamMock = { _id: 'homeTeamId', name: 'Home Team' };
      const awayTeamMock = { _id: 'awayTeamId', name: 'Away Team' };

      // Mock Team.findOne to return home and away teams
      (Team.findOne as jest.Mock)
        .mockResolvedValueOnce(homeTeamMock)
        .mockResolvedValueOnce(awayTeamMock);

      // Mock Fixture.findOne to return an existing fixture
      (Fixture.findOne as jest.Mock).mockResolvedValue({
        homeTeam: 'homeTeamId',
        awayTeam: 'awayTeamId',
        date: new Date('2024-12-01T10:00:00Z'),
      });

      await expect(fixtureService.createFixture(fixtureDto)).rejects.toThrow(BadRequestError);
    });
  });

  describe('updateFixture', () => {
    it('should update the fixture successfully', async () => {
      const fixtureDto: UpdateFixtureDto = {
        homeTeam: 'New Home Team',
        awayTeam: 'New Away Team',
        date: new Date('2024-12-02T10:00:00Z'),
        location: 'location'
      };

      const fixtureMock = {
        _id: 'fixtureId',
        homeTeam: { name: 'Old Home Team' },
        awayTeam: { name: 'Old Away Team' },
        date: '2024-12-01T10:00:00Z',
      };

      const homeTeamMock = { _id: 'newHomeTeamId', name: 'New Home Team' };
      const awayTeamMock = { _id: 'newAwayTeamId', name: 'New Away Team' };

      // Mock fetchFixtureById to return an existing fixture
      jest.spyOn(fixtureService, 'fetchFixtureById').mockResolvedValue(fixtureMock);

      // Mock Team.findOne to return new home and away teams
      (Team.findOne as jest.Mock)
        .mockResolvedValueOnce(homeTeamMock)
        .mockResolvedValueOnce(awayTeamMock);

      // Mock Fixture.findOne to return null (no conflicting fixture)
      (Fixture.findOne as jest.Mock).mockResolvedValue(null);

      // Mock Fixture.findByIdAndUpdate to simulate successful update
      const updateMock = jest.fn().mockResolvedValue({
        _id: 'fixtureId',
        homeTeam: 'newHomeTeamId',
        awayTeam: 'newAwayTeamId',
        date: '2024-12-02T10:00:00Z',
      });
      (Fixture.findByIdAndUpdate as jest.Mock).mockResolvedValue(updateMock);

      const result = await fixtureService.updateFixture('fixtureId', fixtureDto);

      expect(fixtureService.fetchFixtureById).toHaveBeenCalledWith('fixtureId');
      expect(Team.findOne).toHaveBeenCalledTimes(7);
      expect(Fixture.findByIdAndUpdate).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        fixture: updateMock,
        message: 'Fixture updated successfully',
      });
    });

    it('should throw NotFoundError if fixture is not found', async () => {
      const fixtureDto: UpdateFixtureDto = {
        homeTeam: 'New Home Team',
        awayTeam: 'New Away Team',
        date: new Date('2024-12-02T10:00:00Z'),
        location: 'location'
      };

      // Mock fetchFixtureById to return null (fixture not found)
      jest.spyOn(fixtureService, 'fetchFixtureById').mockResolvedValue(null);

      await expect(fixtureService.updateFixture('fixtureId', fixtureDto)).rejects.toThrow(NotFoundError);
    });
  });

  describe('searchFixtures', () => {
    it('should search for fixtures with pagination and sorting', async () => {
      const searchDto: FixtureSearchDto = {
        homeTeamName: 'Home Team',
        awayTeamName: 'Away Team',
        page: 1,
        limit: 2,
        sortBy: 'date',
        order: SortOrder.ASC,
      };

      const homeTeamMock = { _id: 'homeTeamId', name: 'Home Team' };
      const awayTeamMock = { _id: 'awayTeamId', name: 'Away Team' };

      // Mock Team.findOne to return home and away teams
      (Team.findOne as jest.Mock)
        .mockResolvedValueOnce(homeTeamMock)
        .mockResolvedValueOnce(awayTeamMock);

        const mockFixtureFind = {
            populate: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            exec: jest.fn().mockResolvedValueOnce([
              {
                _id: 'fixtureId1',
                homeTeam: homeTeamMock,
                awayTeam: awayTeamMock,
                date: '2024-12-01T10:00:00Z',
              },
              {
                _id: 'fixtureId2',
                homeTeam: homeTeamMock,
                awayTeam: awayTeamMock,
                date: '2024-12-02T10:00:00Z',
              },
            ]),
          };
      

      // Mock Fixture.find to return matching fixtures
      (Fixture.find as jest.Mock).mockReturnValue(mockFixtureFind);

      // Mock Fixture.countDocuments to return total number of matching fixtures
      (Fixture.countDocuments as jest.Mock).mockResolvedValue(2);

      const result = await fixtureService.searchFixtures(searchDto);

      expect(Team.findOne).toHaveBeenCalledTimes(9);
      expect(Fixture.find).toHaveBeenCalledTimes(1);
      expect(Fixture.countDocuments).toHaveBeenCalledTimes(1);
      expect(result.pagination.totalFixtures).toEqual(2);
      expect(result.pagination.totalPages).toEqual(1);
      expect(result.fixtures.length).toEqual(2);
    });
  });
});
