import { Alert, Container, Header, Select, Spinner, Table, TableProps } from "@cloudscape-design/components";
import { useState } from "react";
import { ChampionStat, useSummonerSeasons } from "../api/opgg";
import { useChampions, useVersions } from "../api/dataDragon";

const REGION = "na";
const USERS = new Map([
  ["Miguel", "mGI_ElabdzhqQ1TkTeoaiMbdAvUF86kTXH2nFlXe69GbPTU" ],
  ["Eric", "_6anIVsUPQSeAefs5JHhcOUq8Pq6rEDJ2mqVRT2Zk4yqdcA" ],
  ["Chris", "jTzL4ZBFwVLVsnsJ2JA4xvN9tJoLUiarTmGmWj0bkC3hNbo" ],
  ["Evan", "mGI_ElabdzhqQ1TkTeoaiMbdAvUF86kTXH2nFlXe69GbPTU" ],
  ["Julian", "c9EO7L8faJn5HhQK83_bTgmEcR-bubIc3VXTmRyxPiHMIYE" ],
  ["Gian", "UHsuOOgQdq5GJttpg6dfq033wNjYGHuCXEZncWdH4D7bmH0" ],
]);
const GAME_TYPE = "RANKED";
const SEASONS = [1, 2, 3, 4, 5, 6, 7, 10, 11, 13, 15, 17, 19, 20, 21, 23, 25, 27].reverse()
// const SEASONS = Array.from(Array(25).keys()).map(item => item + 1).reverse();
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

  const {data: seasonData, loading, error } = useSummonerSeasons(SEASONS, REGION, selectedUser.value!, GAME_TYPE);
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
      label: "All"
    })
    return options;
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
      {getTable()}
    </Container>
  }

  function getLoadingState() {
    return <Spinner />
  }

  return loading || loadingChampions || loadingVersions ? getLoadingState() : getContent();
}
