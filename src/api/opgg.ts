import {BaseQueryFn, createApi} from "@reduxjs/toolkit/query/react";
import axios, { AxiosError, AxiosRequestConfig } from "axios"

const OP_GG_BASE_URL = "https://lol-web-api.op.gg/api";

const service = axios.create({
  baseURL: OP_GG_BASE_URL
});

export interface QueryArgs {
  url: string;
  method: AxiosRequestConfig["method"];
  data?: AxiosRequestConfig["data"];
  params?: AxiosRequestConfig["params"];
}

const baseQuery = () : BaseQueryFn<QueryArgs, unknown, unknown> => async ({url, method, data, params}: QueryArgs) => {
  try {
    const result = await service.request({method, url, data, params});
    return {data: result};
  } catch(error) {
    const axiosError = error as AxiosError;
    return {
      error: {
        status: axiosError.response?.status,
        data: axiosError.response?.data || axiosError.message,
      },
    }
  }
}

export interface GetSeasonDataRequest {
  region: string;
  user: string;
  game_type: string;
  season_id: number;
}

export interface ChampionStat {
  id: number;
  play: number;
  win: number;
  lose: number;
  kill: number;
  death: number;
  assist: number;
}

export interface SeasonData {
  game_type: string;
  season_id: number;
  year?: number;
  play: number;
  win: number;
  lose: number;
  champion_stats: ChampionStat[];
}

export interface GetSeasonDataResponse {
  data: SeasonData;
}

export const opggApi = createApi({
  reducerPath: "opggApi",
  baseQuery: baseQuery(),
  endpoints: (builder) => ({
    getSeasonData: builder.query<SeasonData, GetSeasonDataRequest>({
      query: ({region, user, game_type, season_id}: GetSeasonDataRequest) => ({
        url: `/v1.0/internal/bypass/summoners/${region}/${user}/most-champions/rank`,
        method: "GET",
        params: { game_type, season_id },
      }),
      transformResponse: (response: {data: GetSeasonDataResponse}) => (response.data as GetSeasonDataResponse).data
    }),
  }),
})

export const useGetSeasonDataQuery = opggApi.endpoints.getSeasonData.useQuery;
