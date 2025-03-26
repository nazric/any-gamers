import { Alert, Container, Header, Select, Spinner, Table, TableProps } from "@cloudscape-design/components";
import { useState } from "react";
import { ChampionStat, useSummonerSeasons } from "../api/opgg";
import { DATA_DRAGON_BASE_URL, useChampions, useVersions } from "../api/dataDragon";

const REGION = "na";
const USERS = new Map([
  ["Miguel", "mGI_ElabdzhqQ1TkTeoaiMbdAvUF86kTXH2nFlXe69GbPTU" ],
  ["Eric", "_6anIVsUPQSeAefs5JHhcOUq8Pq6rEDJ2mqVRT2Zk4yqdcA" ],
  ["Chris", "jTzL4ZBFwVLVsnsJ2JA4xvN9tJoLUiarTmGmWj0bkC3hNbo" ],
  ["Evan", "mGI_ElabdzhqQ1TkTeoaiMbdAvUF86kTXH2nFlXe69GbPTU" ],
  ["Julian", "c9EO7L8faJn5HhQK83_bTgmEcR-bubIc3VXTmRyxPiHMIYE" ],
  ["Gian", "UHsuOOgQdq5GJttpg6dfq033wNjYGHuCXEZncWdH4D7bmH0" ],
]);
const LATEST_SEASON = 31;
const SEASONS = Array.from(Array(LATEST_SEASON).keys()).map(item => item + 1).reverse();
SEASONS.splice(SEASONS.indexOf(9), 2)  // remove season 8 and 9 as they don't exist
const DEFAULT_VERSION = "14.18.1";

export const SeasonDataTable = () => {

  const [user, setUser] = useState("Eric");
  const selectedUser = {
    value: USERS.get(user),
    label: user
  }

  const seasonOptions = getSeasonOptions();
  const [shownSeason, setShownSeason] = useState(-1);
  const selectedSeason = seasonOptions.find(op => op.value === shownSeason.toString())!;

  const gameTypeOptions = getGameTypeOptions();
  const [gameType, setGameType] = useState("RANKED");
  const selectedGameType = gameTypeOptions.find(op => op.value === gameType)!;

  const {data: seasonData, loading, error } = useSummonerSeasons(SEASONS, REGION, selectedUser.value!, gameType);
  const {data: versions, loading: loadingVersions, error: errorVersions } = useVersions();
  const {data: champions, loading: loadingChampions, error: errorChampions} = useChampions(versions[0] ?? DEFAULT_VERSION);

  function getUserOptions() {
    return Array.from(USERS.keys()).map(u => {
      return {
        value: USERS.get(u),
        label: u
      }
    })
  }

  function getSeasonOptions() {
    const options = SEASONS.map(season_id => {
      return {
        value: season_id.toString(),
        label: `Season ${season_id.toString()}`,
      }
    });
    options.unshift({
      value: "-1",
      label: "All Seasons"
    })
    return options;
  }

  function getGameTypeOptions() {
    return [
      {
        value: "RANKED",
        label: "Ranked (solo/duo & flex)"
      },
      {
        value: "SOLORANKED",
        label: "Ranked Solo/Duo"
      },
      {
        value: "FLEXRANKED",
        label: "Ranked Flex"
      },
    ]
  }

  function containerHeader() {
    return <Header variant="h2" description="seasonData.container.description">
      seasonData.container.title
    </Header>
  }

  function errorAlert(error: string) {
    return <Alert type="error">
      {error}
      {errorVersions}
      {errorChampions}
    </Alert>
  }

  function getColumnDefs(): TableProps.ColumnDefinition<ChampionStat>[] {
    return [
      {
        id: "id",
        header: "Id",
        cell: (item) => item.id,
      },
      {
        id: "portrait",
        header: "",
        cell: (item) => <img 
          src={`${DATA_DRAGON_BASE_URL}/cdn/${versions[0]}/img/champion/${champions.get(item.id)!.id}.png`}
          alt="name"
          width="40"
          />
      },
      {
        id: "name",
        header: "Name",
        cell: (item) => champions.get(item.id)?.name,
      },
      {
        id: "winrate",
        header: "Win Rate",
        cell: (item) => `${(100 * item.win / (item.win + item.lose)).toFixed(2)}% (${item.win}W / ${item.lose}L)`,
      },
      {
        id: "kda",
        header: "KDA",
        cell: (item) => `${((item.kill + item.assist) / item.death).toFixed(2)} (${item.kill}/${item.assist}/${item.death})`,
      }
    ]
  }

  function getTable() {
    return <Table trackBy={"id"} items={seasonData.get(shownSeason)?.champion_stats!} columnDefinitions={getColumnDefs()} />
  }

  function getContent() {
    return <Container header={containerHeader()} >
      {error || errorVersions || errorChampions ? errorAlert(error as string) : <></>}
      <Select options={getUserOptions()} selectedOption={selectedUser} onChange={(e) => setUser(e.detail.selectedOption.label!)} ></Select>
      <Select options={seasonOptions} selectedOption={selectedSeason} onChange={(e) => setShownSeason(parseInt(e.detail.selectedOption.value!))} ></Select>
      <Select options={gameTypeOptions} selectedOption={selectedGameType} onChange={(e) => setGameType(e.detail.selectedOption.value!)} ></Select>
      {getTable()}
    </Container>
  }

  function getLoadingState() {
    return <Spinner />
  }

  return loading || loadingChampions || loadingVersions ? getLoadingState() : getContent();
}
