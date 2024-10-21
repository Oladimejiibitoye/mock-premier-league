import { Schema, model, Document } from 'mongoose';

export interface ITeam extends Document {
  name: string;
  country: string
}

const teamSchema = new Schema<ITeam>({
  name: { type: String, required: true },
  country: { type: String, required: true }
});

export const Team = model<ITeam>('Team', teamSchema);
