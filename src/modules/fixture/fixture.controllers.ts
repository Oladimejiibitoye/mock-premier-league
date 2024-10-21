import { NextFunction, Request, Response } from 'express';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { successResMsg } from '../../utils/response';
import { StatusCodes } from 'http-status-codes';
import { fixtureService } from './fixture.services';
import { CreateFixtureDto, FixtureIdDto, FixtureSearchDto, UpdateFixtureDto } from './fixture.dto';

class FixtureController{
  async createFixture (req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
        const fixtureDto = plainToClass(CreateFixtureDto, req.body);

        const errors = await validate(fixtureDto);
        if (errors.length > 0) {
        return res.status(422).json({ message: 'Validation failed', errors });
        }

        const response = await fixtureService.createFixture(fixtureDto)

        return successResMsg(res, StatusCodes.CREATED, {message: response.message, data: response.fixture})
    } catch (error) {
        next(error)
    }
  }

  async editFixture (req: Request, res: Response, next: NextFunction): Promise<any>{
    try {
        const fixtureDto = plainToClass(UpdateFixtureDto, req.body);

        const errors = await validate(fixtureDto);
        if (errors.length > 0) {
        return res.status(422).json({ message: 'Validation failed', errors });
        }

        const response = await fixtureService.updateFixture(req.params.id, fixtureDto)

        return successResMsg(res, StatusCodes.OK, {message: response.message, data: response.fixture})
    } catch (error) {
        next(error)
    }
  }

  async removeFixture(req: Request, res: Response, next: NextFunction): Promise<any>{
    try {
        const fixtureIdDto = Object.assign(new FixtureIdDto(), req.params);

        const errors = await validate(fixtureIdDto);
        if (errors.length > 0) {
        return res.status(422).json({ message: 'Validation failed', errors });
        }

        const response = await fixtureService.removeFixture(fixtureIdDto.id)

        return successResMsg(res, StatusCodes.OK, {message: response.message})
    } catch (error) {
        next(error)
    }
  }

  async viewFixture(req: Request, res: Response, next: NextFunction): Promise<any>{
    try {
        const fixtureIdDto = Object.assign(new FixtureIdDto(), req.params);

        const errors = await validate(fixtureIdDto);
        if (errors.length > 0) {
        return res.status(422).json({ message: 'Validation failed', errors });
        }

        const response = await fixtureService.fetchFixtureById(fixtureIdDto.id)

        return successResMsg(res, StatusCodes.OK, {message: 'fixture fetched successfully', data: response})
    } catch (error) {
        next(error)
    }
  }

  async searchFixture(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
        const fixtureSearchDto = plainToClass(FixtureSearchDto, req.query);

        const errors = await validate(fixtureSearchDto);
        if (errors.length > 0) {
        return res.status(422).json({ message: 'Validation failed', errors });
        }

        const response = await fixtureService.searchFixtures(fixtureSearchDto)

        return successResMsg(res, StatusCodes.OK, {message: 'Fixtures fetched sucessfully', data: response})
    } catch (error) {
        next(error)
    }
  }
};

export const fixtureController = new FixtureController()
