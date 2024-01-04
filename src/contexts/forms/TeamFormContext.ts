import {createFormContext} from "@mantine/form";
import {ITeam} from "@/types/data/db-model-interfaces";

export interface IFormTeam extends Required<Omit<ITeam, 'createdAt' | 'updatedAt' | 'erds'>>{}

export const [TeamFormProvider, useTeamFormContext, useTeamForm] = createFormContext<IFormTeam>()
