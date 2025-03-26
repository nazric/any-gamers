import axios, { AxiosRequestConfig, AxiosResponse } from "axios"
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

const serviceCache = new Map<string, any>();

export const useSummonerSeasons = (seasons: number[], region: string, user: string, game_type: string) => {
  const [data, setData] = useState<Map<number, SeasonData>>(new Map());
  // const [loading, setLoading] = useState<Map<number, boolean>>(new Map());
  const [loading, setLoading] = useState(false);
  // const [error, setError] = useState<Map<number, string | null>>(new Map());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function onfulfilled(value: AxiosResponse<GetSeasonDataResponse, any>[]) {
      const season_map = new Map<number, SeasonData>();
      value.forEach(response => {
        season_map.set(response.data.data.season_id, response.data.data)
      });
  
      if (!season_map.has(-1)) {
        const allSeasons = createAllSeason(season_map, game_type);
        season_map.set(-1, allSeasons);
      }
      setData(season_map);
      setLoading(false);
    }
  
    function onrejected(reason: any) {
      setError("Error fetching from OP.GG: " + reason);
      setLoading(false);
    }
    
    const fetchData = async () => {
      setLoading(true);

      const promises = seasons.map(async season_id => {
        const request = {
          url: `/v1.0/internal/bypass/summoners/${region}/${user}/most-champions/rank`,
          method: "GET",
          params: { game_type, season_id },
        }
        const requestSignature = JSON.stringify(request);
        if (serviceCache.has(requestSignature)) {
          return Promise.resolve(serviceCache.get(requestSignature));
        }
        const response = service.request<GetSeasonDataResponse>(request);
        serviceCache.set(requestSignature, response)
        return response;
      });

      Promise.all(promises).then(onfulfilled, onrejected)
    };

    fetchData();
  }, [game_type, region, seasons, user]);

  return { data, loading, error };
};

function createAllSeason(season_map: Map<number, SeasonData>, game_type: string) {
  const allSeasons = {} as SeasonData;
  const champStats = new Map<number, ChampionStat>();
  season_map.forEach(season => {
    if (game_type !== "FLEXRANKED" || season.game_type === "FLEXRANKED") {
      allSeasons.play += season.play;
      allSeasons.lose += season.lose;
      allSeasons.win += season.win;
      if (season.champion_stats) {
        season.champion_stats.forEach(champ => {
          if (champStats.has(champ.id)) {
            const stats = champStats.get(champ.id)!;
            stats.assist += champ.assist;
            stats.damage_dealt += champ.damage_dealt;
            stats.damage_dealt_to_champions += champ.damage_dealt_to_champions;
            stats.assist += champ.assist;
            stats.damage_dealt_to_objectives += champ.damage_dealt_to_objectives;
            stats.damage_dealt_to_turrets += champ.damage_dealt_to_turrets;
            stats.damage_self_mitigated += champ.assist;
            stats.damage_taken += champ.damage_taken;
            stats.death += champ.death;
            stats.double_kill += champ.double_kill;
            stats.game_length_second += champ.game_length_second;
            stats.gold_earned += champ.gold_earned;
            stats.heal += champ.heal;
            stats.inhibitor_kills += champ.inhibitor_kills;
            stats.is_max_in_team_op_score += champ.is_max_in_team_op_score;
            stats.kill += champ.kill;
            stats.lose += champ.lose;
            stats.magic_damage_dealt += champ.magic_damage_dealt;
            stats.magic_damage_dealt_to_champions += champ.magic_damage_dealt_to_champions;
            stats.max_death = Math.max(stats.max_death, champ.max_death);
            stats.max_kill = Math.max(stats.max_kill, champ.max_kill);
            stats.max_largest_critical_strike = Math.max(stats.max_largest_critical_strike, champ.max_largest_critical_strike);
            stats.max_largest_killing_spree = Math.max(stats.max_largest_killing_spree, champ.max_largest_killing_spree);
            stats.max_largest_multi_kill = Math.max(stats.max_largest_multi_kill, champ.max_largest_multi_kill);
            stats.minion_kill += champ.minion_kill;
            stats.most_kill += champ.most_kill;
            stats.neutral_minion_kill += champ.heal;
            stats.op_score += champ.op_score;
            stats.penta_kill += champ.penta_kill;
            stats.physical_damage_dealt += champ.physical_damage_dealt;
            stats.physical_damage_dealt_to_champions += champ.physical_damage_dealt_to_champions;
            stats.physical_damage_taken += champ.physical_damage_taken;
            stats.play += champ.play;
            stats.quadra_kill += champ.quadra_kill;
            stats.sight_wards_bought_in_game += champ.sight_wards_bought_in_game;
            stats.snowball_hits += champ.snowball_hits;
            stats.snowball_throws += champ.snowball_throws;
            stats.time_ccing_others += champ.time_ccing_others;
            stats.triple_kill += champ.triple_kill;
            stats.turret_kill += champ.turret_kill;
            stats.vision_score += champ.vision_score;
            stats.vision_wards_bought_in_game += champ.vision_wards_bought_in_game;
            stats.wards_killed += champ.wards_killed;
            stats.wards_placed += champ.wards_placed;
            stats.win += champ.win;
          } else {
            champStats.set(champ.id, JSON.parse(JSON.stringify(champ)));
          }
        });
      }
    }
  });
  allSeasons.champion_stats = Array.from(champStats.values()).sort((a, b) => b.play - a.play);
  return allSeasons;
}

