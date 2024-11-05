import {erdApis} from "@/api/erd"
import {Erd} from "@/types/data/db-model-interfaces"
import {useQuery} from "@tanstack/react-query"
import {Location, useLocation, useParams} from "react-router-dom"

interface LocationState {
  erd?: Erd
}

export const useErd = () => {
  const {state} = useLocation() as Location<LocationState>
  const params = useParams<'erdId'>()

  return useQuery({
    queryKey: ['erd', params.erdId!],
    initialData: state?.erd,
    queryFn: erdApis.detail
  })
}
