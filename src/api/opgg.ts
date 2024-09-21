import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios"
import { useEffect, useState } from "react";

const OP_GG_BASE_URL = "https://lol-web-api.op.gg/api";


export interface QueryArgs {
  url: string;
  method: AxiosRequestConfig["method"];
  data?: AxiosRequestConfig["data"];
  params?: AxiosRequestConfig["params"];
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
  "gold_earned": number,
  "minion_kill": number,
  "turret_kill": number,
  "neutral_minion_kill": number,
  "damage_dealt": number,
  "damage_taken": number,
  "physical_damage_dealt": number,
  "magic_damage_dealt": number,
  "most_kill": number,
  "max_kill": number,
  "max_death": number,
  "double_kill": number,
  "triple_kill": number,
  "quadra_kill": number,
  "penta_kill": number,
  "game_length_second": number,
  "inhibitor_kills": number,
  "sight_wards_bought_in_game": number,
  "vision_wards_bought_in_game": number,
  "vision_score": number,
  "wards_placed": number,
  "wards_killed": number,
  "heal": number,
  "time_ccing_others": number,
  "op_score": number,
  "is_max_in_team_op_score": number,
  "physical_damage_taken": number,
  "damage_dealt_to_champions": number,
  "physical_damage_dealt_to_champions": number,
  "magic_damage_dealt_to_champions": number,
  "damage_dealt_to_objectives": number,
  "damage_dealt_to_turrets": number,
  "damage_self_mitigated": number,
  "max_largest_multi_kill": number,
  "max_largest_critical_strike": number,
  "max_largest_killing_spree": number,
  "snowball_throws": number,
  "snowball_hits": number
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

const service = axios.create({
  baseURL: OP_GG_BASE_URL
});

export const useSummonerSeasons = (seasons: number[], region: string, user: string, game_type: string) => {
  const [data, setData] = useState<Map<number, SeasonData>>(new Map());
  // const [loading, setLoading] = useState<Map<number, boolean>>(new Map());
  const [loading, setLoading] = useState(false);
  // const [error, setError] = useState<Map<number, string | null>>(new Map());
  const [error, setError] = useState<string | null>(null);

  function onfulfilled(value: AxiosResponse<GetSeasonDataResponse, any>[]) {
    const season_map = new Map<number, SeasonData>();
    value.forEach(response => {
      season_map.set(response.data.data.season_id, response.data.data)
    });
    setData(season_map);
    setLoading(false);
  }

  function onrejected(reason: any) {
    setError("Error fetching from OP.GG: " + reason);
    setLoading(false);
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const promises = seasons.map(async season_id => {
        return service.request<GetSeasonDataResponse>({
          url: `/v1.0/internal/bypass/summoners/${region}/${user}/most-champions/rank`,
          method: "GET",
          params: { game_type, season_id },
        });
      });

      Promise.all(promises).then(onfulfilled, onrejected)
    };

    fetchData();
  }, []);

  return { data, loading, error };
};
