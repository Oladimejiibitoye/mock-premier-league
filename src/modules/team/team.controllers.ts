import { NextFunction, Request, Response } from 'express';
import { validate } from 'class-validator';
import { successResMsg } from '../../utils/response';
import { StatusCodes } from 'http-status-codes';
import { teamService } from './team.services';
import { TeamDto, TeamIdDto, TeamSearchDto } from './team.dto';
import { plainToClass } from 'class-transformer';

class TeamController{
  async addTeam (req: Request, res: Response, next: NextFunction): Promise<any>{
    try {
        const teamDto = Object.assign(new TeamDto(), req.body);

        const errors = await validate(teamDto);
        if (errors.length > 0) {
        return res.status(422).json({ message: 'Validation failed', errors });
        }

        const response = await teamService.addTeam(teamDto)

        return successResMsg(res, StatusCodes.CREATED, {message: response.message, data: {id: response.id}})
    } catch (error) {
        next(error)
    }
  }

  async editTeam(req: Request, res: Response, next: NextFunction): Promise<any>{
    try {
        const teamDto = Object.assign(new TeamDto(), req.body);

        const errors = await validate(teamDto);
        if (errors.length > 0) {
        return res.status(422).json({ message: 'Validation failed', errors });
        }

        const response = await teamService.updateTeam(req.params.id, teamDto)

        return successResMsg(res, StatusCodes.OK, {message: response.message})
    } catch (error) {
        next(error)
    }
  }

  async removeTeam(req: Request, res: Response, next: NextFunction): Promise<any>{
    try {
        const teamIdDto = Object.assign(new TeamIdDto(), req.params);

        const errors = await validate(teamIdDto);
        if (errors.length > 0) {
        return res.status(422).json({ message: 'Validation failed', errors });
        }

        const response = await teamService.removeTeam(teamIdDto.id)

        return successResMsg(res, StatusCodes.OK, {message: response.message})
    } catch (error) {
        next(error)
    }
  }

  async viewTeam(req: Request, res: Response, next: NextFunction): Promise<any>{
    try {
        const teamIdDto = Object.assign(new TeamIdDto(), req.params);

        const errors = await validate(teamIdDto);
        if (errors.length > 0) {
        return res.status(422).json({ message: 'Validation failed', errors });
        }

        const response = await teamService.fetchTeamById(teamIdDto.id)

        return successResMsg(res, StatusCodes.OK, {message: response.message, data: response.data})
    } catch (error) {
        next(error)
    }
  }

  async searchTeam(req: Request, res: Response, next: NextFunction): Promise<any>{
    try {
        const teamSearchDto = plainToClass(TeamSearchDto, req.query);

        const errors = await validate(teamSearchDto);
        if (errors.length > 0) {
        return res.status(422).json({ message: 'Validation failed', errors });
        }

        const response = await teamService.searchTeam(teamSearchDto)

        return successResMsg(res, StatusCodes.OK, {message: 'Teams fetched sucessfully', data: response})
    } catch (error) {
        next(error)
    }
  }
};

export const teamController = new TeamController()
