import {createFormContext} from "@mantine/form";
import {ITeam} from "@/types/data/db-model-interfaces.ts";

export const [TeamFormProvider, useTeamFormContext, useTeamForm] = createFormContext<ITeam>()
