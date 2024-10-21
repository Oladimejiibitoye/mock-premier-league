import { BadRequestError, InternalServerError, NotFoundError } from '../../utils/errors';
import { Team } from '../../models/team';
import { TeamDto, TeamSearchDto } from './team.dto';
import { SortOrder } from '../fixture/fixture.dto';


class TeamService {


  constructor() {}

  // create a team
  async addTeam(teamDto: TeamDto): Promise<{ id: any, message: string }> {
    const { name, country } = teamDto;

    // Check if team already exists
    const existingTeam = await Team.findOne({ name: new RegExp(name, 'i') });
    if (existingTeam) {
      throw new BadRequestError('Team already exists');
    }

    // Create the new team
    const newTeam = new Team({
      name,
      country
    });

    const team = await newTeam.save();
    return { id: team._id, message: 'Team added successfully' };
  }

  //remove a team
  async removeTeam(teamId: string): Promise<{message: string}> {
    await Team.findByIdAndDelete(teamId)

    return {message: 'Team removed successfully'}
  }

  async fetchTeamById(teamId: string): Promise<any> {
    const data = await Team.findById(teamId)

    return {message: 'Team fetched successfully', data}
  }

  async updateTeam(teamId: string, teamDto: TeamDto): Promise<{message: string}> {
    const { name} = teamDto;

    const existingTeam = await Team.findById(teamId)
    if (!existingTeam) {
        throw new NotFoundError('Team does not exists');
    }

    if(name.toLowerCase() !== existingTeam.name.toLowerCase()){
        // Check if team already exists
        const existingTeamWithName = await Team.findOne({ name: new RegExp(name, 'i') });
        if (existingTeamWithName) {
            throw new BadRequestError('Team already exists');
        }
    }

    await Team.findByIdAndUpdate(teamId, { $set: teamDto})
    return {message: 'Team updated successfully'}
  }


/**
   * Search for teams by name, country, or both with pagination and sorting.
   * @param name - Optional team name.
   * @param country - Optional team country.
   * @param page - Current page number.
   * @param limit - Number of items per page.
   * @param sortBy - Field to sort by (e.g., 'name', 'country').
   * @param order - Sort direction ('asc' for ascending, 'desc' for descending).
   * @returns - List of matching teams with pagination info.
   */
    async searchTeam(searchQueryDto: TeamSearchDto) {
        let {name, country, page, limit, sortBy, order} = searchQueryDto;

        // Validate page and limit
        if (!page || page < 1) {
            page = 1
        }
        if (!limit || limit < 1) {
            limit = 10
        }

        if (!sortBy) {
            sortBy = 'name'
        }

        if (!order){
            order = SortOrder.ASC
        }

         // Build dynamic search query based on provided parameters
      const query: any = {};

      if (name) {
        query.name = { $regex: new RegExp(name, 'i') }; // Case-insensitive search for name
      }

      if (country) {
        query.country = { $regex: new RegExp(country, 'i') }; // Case-insensitive search for country
      }

      // Calculate how many documents to skip based on page and limit
      const skip = (page - 1) * limit;

      // Define sort order (convert 'asc' to 1 and 'desc' to -1 for MongoDB sorting)
      const sortOrder = order === 'asc' ? 1 : -1;

      // Query the database for matching teams with pagination and sorting
      const teams = await Team.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ [sortBy]: sortOrder });

      // Count the total number of matching teams
      const totalTeams = await Team.countDocuments(query);

      // Calculate the total number of pages
      const totalPages = Math.ceil(totalTeams / limit);

      return {
        teams,
        pagination: {
          totalTeams,
          totalPages,
          currentPage: page,
          pageSize: limit,
        }
      }
    }
}

export const teamService = new TeamService()
