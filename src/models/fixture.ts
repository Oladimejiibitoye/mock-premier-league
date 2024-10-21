import { Schema, model, Document } from 'mongoose';
import { ITeam } from './team';  

export interface IFixture extends Document {
  homeTeam: ITeam['_id'];  // Reference to Team model's _id
  awayTeam: ITeam['_id'];  // Reference to Team model's _id
  date: Date;
  location: string;
  status: 'pending' | 'completed';
  homeTeamScore?: number;
  awayTeamScore?: number;
  uniqueLink: string;
}

const fixtureSchema = new Schema<IFixture>({
  homeTeam: { type: Schema.Types.ObjectId, ref: 'Team', required: true },  // Reference to Team model
  awayTeam: { type: Schema.Types.ObjectId, ref: 'Team', required: true },  // Reference to Team model
  date: { type: Date, required: true },
  location: { type: String, required: true },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending', required: true },
  homeTeamScore: { type: Number, default: 0 },  // Optional: only for completed fixtures
  awayTeamScore: { type: Number, default: 0 },  // Optional: only for completed fixtures
  uniqueLink: { type: String, required: true, unique: true }
});

export const Fixture = model<IFixture>('Fixture', fixtureSchema);

