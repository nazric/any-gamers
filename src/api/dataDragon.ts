import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";

// https://ddragon.leagueoflegends.com/api/versions.json
const DATA_DRAGON_BASE_URL = "https://ddragon.leagueoflegends.com";

export interface Champion {
  "version": string;
  "id": string;
  "key": string; // opgg ID
  "name": string;
  "title": string;
  "blurb": string;
  "tags": string[];
  "partype": string;
  "image": {
    "full": string;
    "sprite": string;
    "group": string;
    "x": number;
    "y": number;
    "w": number;
    "h": number;
  }
}

export interface GetChampionsResponse {
  "type": string,
  "format": string,
  "version": string,
  "data": object
}


const service = axios.create({
  baseURL: DATA_DRAGON_BASE_URL
});

export const useVersions = () => {
  const [data, setData] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response: AxiosResponse<string[]> = await service.request({
          url: `/api/versions.json`,
          method: "GET",
        });
        setData(response.data);
        setLoading(false);
      } catch (e) {
        setError("Error loading champion data: " + e);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

export const useChampions = (version: string) => {
  const [data, setData] = useState<Map<number, Champion>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response: AxiosResponse<GetChampionsResponse> = await service.request({
          url: `/cdn/${version}/data/en_US/champion.json`,
          method: "GET",
        });
        const championMap = new Map<number, Champion>();
        Object.values(response.data.data).forEach(champion =>
          championMap.set(+champion.key, champion)
        );
        setData(championMap);
        setLoading(false);
      } catch (e) {
        setError("Error loading champion data: " + e);
        setLoading(false);
      }
    };

    fetchData();
  }, [version]);

  return { data, loading, error };
};
