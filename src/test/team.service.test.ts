import 'reflect-metadata';
import { teamService } from '../modules/team/team.services';
import { Team } from '../models/team';
import { BadRequestError, NotFoundError } from '../utils/errors';
import { TeamSearchDto } from '../modules/team/team.dto';
import { SortOrder } from '../modules/fixture/fixture.dto';

// Mock the Team model
jest.mock('../src/models/team');

describe('TeamService', () => {


  afterEach(() => {
    jest.clearAllMocks(); // Clear mock data between tests
  });

  describe('addTeam', () => {
    it('should add a new team successfully', async () => {
      const teamDto = { name: 'Team A', country: 'Country A' };

      // Mock findOne to return null (no existing team)
      (Team.findOne as jest.Mock).mockResolvedValue(null);
      // Mock save function to return the created team
      (Team.prototype.save as jest.Mock).mockResolvedValue({ _id: 'teamId', ...teamDto });

      const result = await teamService.addTeam(teamDto);

      expect(Team.findOne).toHaveBeenCalledWith({ name: /Team A/i });
      expect(Team.prototype.save).toHaveBeenCalled();
      expect(result).toEqual({ id: 'teamId', message: 'Team added successfully' });
    });

    it('should throw BadRequestError if team already exists', async () => {
      const teamDto = { name: 'Team A', country: 'Country A' };

      // Mock findOne to return an existing team
      (Team.findOne as jest.Mock).mockResolvedValue({ name: 'Team A' });

      await expect(teamService.addTeam(teamDto)).rejects.toThrow(BadRequestError);
    });
  });

  describe('removeTeam', () => {
    it('should remove the team successfully', async () => {
      const teamId = 'teamId';

      // Mock findByIdAndDelete to resolve successfully
      (Team.findByIdAndDelete as jest.Mock).mockResolvedValue({ _id: teamId });

      const result = await teamService.removeTeam(teamId);

      expect(Team.findByIdAndDelete).toHaveBeenCalledWith(teamId);
      expect(result).toEqual({ message: 'Team removed successfully' });
    });
  });

  describe('fetchTeamById', () => {
    it('should fetch the team by id successfully', async () => {
      const teamId = 'teamId';
      const teamData = { _id: teamId, name: 'Team A', country: 'Country A' };

      // Mock findById to return a team
      (Team.findById as jest.Mock).mockResolvedValue(teamData);

      const result = await teamService.fetchTeamById(teamId);

      expect(Team.findById).toHaveBeenCalledWith(teamId);
      expect(result).toEqual({ message: 'Team fetched successfully', data: teamData });
    });
  });

  describe('updateTeam', () => {
    it('should update the team successfully', async () => {
      const teamId = 'teamId';
      const teamDto = { name: 'Updated Team2', country: 'Updated Country' };
      const existingTeam = { _id: teamId, name: 'Old Team', country: 'Old Country' };

      // Mock findById to return an existing team
      (Team.findById as jest.Mock).mockResolvedValue(existingTeam);
      (Team.findOne as jest.Mock).mockResolvedValue(null)
      // Mock findByIdAndUpdate to return updated team
      const updateMock = jest.fn().mockResolvedValue({
        _id: teamId,
        ...teamDto
      });
      (Team.findByIdAndUpdate as jest.Mock).mockResolvedValue(updateMock);

      const result = await teamService.updateTeam(teamId, teamDto);

      expect(Team.findById).toHaveBeenCalledWith(teamId);
      expect(Team.findByIdAndUpdate).toHaveBeenCalledWith(teamId, { $set: teamDto });
      expect(result).toEqual({ message: 'Team updated successfully' });
    });

    it('should throw NotFoundError if team is not found', async () => {
      const teamId = 'teamId';
      const teamDto = { name: 'Updated Team', country: 'Updated Country' };

      // Mock findById to return null
      (Team.findById as jest.Mock).mockResolvedValue(null);

      await expect(teamService.updateTeam(teamId, teamDto)).rejects.toThrow(NotFoundError);
    });

    it('should throw BadRequestError if updating to a team name that already exists', async () => {
      const teamId = 'teamId';
      const teamDto = { name: 'New Team', country: 'Updated Country' };
      const existingTeam = { _id: teamId, name: 'Old Team', country: 'Old Country' };

      // Mock findById to return the existing team to be updated
      (Team.findById as jest.Mock).mockResolvedValue(existingTeam);
      // Mock findOne to return another team with the same name
      (Team.findOne as jest.Mock).mockResolvedValue({ _id: 'anotherTeamId', name: 'New Team' });

      await expect(teamService.updateTeam(teamId, teamDto)).rejects.toThrow(BadRequestError);
    });
  });

  describe('searchTeam', () => {
    it('should search and return teams with pagination and sorting', async () => {
      const searchQueryDto: TeamSearchDto = { name: 'Team', country: 'Country', page: 1, limit: 10, sortBy: 'name', order: SortOrder.ASC };
      const teams = [{ _id: 'teamId', name: 'Team A', country: 'Country A' }];
      const totalTeams = 1;

      // Mock find and countDocuments to return matching teams and total count
      (Team.find as jest.Mock).mockReturnValue({ skip: jest.fn().mockReturnThis(), limit: jest.fn().mockReturnThis(), sort: jest.fn().mockResolvedValue(teams) });
      (Team.countDocuments as jest.Mock).mockResolvedValue(totalTeams);

      const result = await teamService.searchTeam(searchQueryDto);

      expect(Team.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        teams,
        pagination: {
          totalTeams,
          totalPages: 1,
          currentPage: 1,
          pageSize: 10,
        },
      });
    });
  });
});
