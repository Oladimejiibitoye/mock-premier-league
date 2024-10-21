import { BadRequestError, NotFoundError } from '../../utils/errors';
import { Team } from '../../models/team';
import { Fixture } from '../../models/fixture';
import { CreateFixtureDto, FixtureSearchDto, SortOrder, UpdateFixtureDto } from './fixture.dto';



class FixtureService {


  constructor() {}

  // create a fixture
  async createFixture(fixtureDto: CreateFixtureDto): Promise<{ fixture: any, message: string }> {
    const { homeTeam, awayTeam, date } = fixtureDto;

    // Check if home team exists
    const existingHomeTeam = await Team.findOne({ name: new RegExp(homeTeam, 'i') });
    if (!existingHomeTeam) {
      throw new NotFoundError('Home team does not exists');
    }

    // check if away team exists
    const existingAwayTeam = await Team.findOne({ name: new RegExp(awayTeam, 'i') });
    if (!existingAwayTeam) {
      throw new NotFoundError('Away team does not exists');
    }

    const existingFixture = await Fixture.findOne({
        homeTeam: existingHomeTeam._id,
        awayTeam: existingAwayTeam._id,
        date: new Date(date)
    })
    if(existingFixture){
        throw new BadRequestError('fixture already exist')
    }

    fixtureDto.homeTeam = existingHomeTeam._id as string
    fixtureDto.awayTeam = existingAwayTeam._id as string

    // Create the new team
    const newFixture= new Fixture({
        ...fixtureDto
    });

    newFixture.uniqueLink = `fixture/${newFixture._id}`

    const fixture = await newFixture.save();
    return { fixture, message: 'Fixture created successfully' };
  }

  //remove a team
  async removeFixture(fixtureId: string): Promise<{message: string}> {
    await Fixture.findByIdAndDelete(fixtureId)

    return {message: 'Fixture removed successfully'}
  }

  async fetchFixtureById(fixtureId: string): Promise<any> {
    return Fixture.findById(fixtureId).populate('homeTeam awayTeam').exec()
  }

  async updateFixture(fixtureId: string, fixtureDto: UpdateFixtureDto): Promise<{fixture: any, message: string}> {
    const { homeTeam, awayTeam, date} = fixtureDto;

    const fixture = await this.fetchFixtureById(fixtureId)

    if(!fixture){
        throw new NotFoundError('fixture not found')
    }

    // Check if home team exists
    const existingHomeTeam = await Team.findOne({ name: new RegExp(homeTeam, 'i') });
    if (!existingHomeTeam) {
      throw new NotFoundError('Home team does not exists');
    }

    // check if away team exists
    const existingAwayTeam = await Team.findOne({ name: new RegExp(awayTeam, 'i') });
    if (!existingAwayTeam) {
      throw new NotFoundError('Away team does not exists');
    }

    if(fixture.homeTeam.name !== homeTeam || fixture.awayTeam.name !== awayTeam){
        const existingFixture = await Fixture.findOne({
            homeTeam: existingHomeTeam._id,
            awayTeam: existingAwayTeam._id,
            date: new Date(date)
        })
        if(existingFixture){
            throw new BadRequestError('fixture already exist')
        }
    }

    fixtureDto.homeTeam = existingHomeTeam._id as string
    fixtureDto.awayTeam = existingAwayTeam._id as string

    const updatedFixture = await Fixture.findByIdAndUpdate(fixtureId, {$set: fixtureDto})

    return { fixture: updatedFixture, message: 'Fixture updated successfully' };
  }

  /**
   * Search for fixtures by team, status, or date range with pagination and sorting.
   * @param homeTeam - Optional home team name.
   * @param awayTeam - Optional away team name.
   * @param status - Optional fixture status ('completed' or 'pending').
   * @param startDate - Optional start date filter (ISO string).
   * @param endDate - Optional end date filter (ISO string).
   * @param page - Current page number.
   * @param limit - Number of items per page.
   * @param sortBy - Field to sort by (e.g., 'date', 'homeTeam', 'awayTeam').
   * @param order - Sort direction ('asc' for ascending, 'desc' for descending).
   * @returns - List of matching fixtures with pagination info.
   */
  async searchFixtures(searchQueryDto: FixtureSearchDto) {
    let {homeTeamName, awayTeamName, status, startDate, endDate, page, limit, sortBy, order} = searchQueryDto

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

      // Add optional team name filters
      if (homeTeamName) {
        const homeTeam = await Team.findOne({ name: new RegExp(homeTeamName, 'i') });
        query.homeTeam = homeTeam?._id
      }

      if (awayTeamName) {
        const awayTeam = await Team.findOne({ name: new RegExp(awayTeamName, 'i') });
        query.awayTeam = awayTeam?._id;
      }

      // Add optional status filter
      if (status) {
        query.status = status;
      }

      // Add optional date filter (if both startDate and endDate are provided)
      if (startDate || endDate) {
        query.date = {};
        if (startDate) {
          query.date.$gte = new Date(startDate);
        }
        if (endDate) {
          query.date.$lte = new Date(endDate);
        }
      }

      // Calculate how many documents to skip based on page and limit
      const skip = (page - 1) * limit;

      // Define sort order (convert 'asc' to 1 and 'desc' to -1 for MongoDB sorting)
      const sortOrder = order === 'asc' ? 1 : -1;

      // Query the database for matching fixtures with pagination and sorting
      const fixtures = await Fixture.find(query)
        .populate('homeTeam awayTeam')
        .skip(skip)
        .limit(limit)
        .sort({ [sortBy]: sortOrder })
        .exec();

      // Count the total number of matching fixtures
      const totalFixtures = await Fixture.countDocuments(query);

      // Calculate the total number of pages
      const totalPages = Math.ceil(totalFixtures / limit);

      return {
        fixtures,
        pagination: {
          totalFixtures,
          totalPages,
          currentPage: page,
          pageSize: limit,
        }
      };
    
  }


}

export const fixtureService = new FixtureService()
