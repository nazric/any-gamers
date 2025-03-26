import { Alert, CollectionPreferences, CollectionPreferencesProps, Container, FormField, Header, KeyValuePairs, Pagination, Select, SpaceBetween, Spinner, Table, TableProps, TextFilter } from "@cloudscape-design/components";
import { useState } from "react";
import { ChampionStat, useSummonerSeasons } from "../api/opgg";
import { DATA_DRAGON_BASE_URL, useChampions, useVersions } from "../api/dataDragon";
import { useCollection } from "@cloudscape-design/collection-hooks";

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

  const gameTypeOptions = getGameTypeOptions();
  const [gameType, setGameType] = useState("RANKED");
  const selectedGameType = gameTypeOptions.find(op => op.value === gameType)!;

  const {data: seasonData, loading, error } = useSummonerSeasons(SEASONS, REGION, selectedUser.value!, gameType);
  const {data: versions, loading: loadingVersions, error: errorVersions } = useVersions();
  const {data: champions, loading: loadingChampions, error: errorChampions} = useChampions(versions[0] ?? DEFAULT_VERSION);

  const seasonOptions = getSeasonOptions();
  const [season, setShownSeason] = useState(-1);
  const selectedSeason = seasonOptions.find(op => op.value === season.toString())!;

  const [preferences, setPreferences] = useState({
    pageSize: 10,
    contentDisplay: [
      { id: 'portrait', visible: true,  },
      { id: 'name', visible: true },
      { id: 'winrate', visible: true },
      { id: 'kda', visible: true },
    ],
  } as CollectionPreferencesProps.Preferences<ChampionStat>);
  const {items, actions, filteredItemsCount, collectionProps, filterProps, paginationProps} = useCollection(
    seasonData?.get(season)?.champion_stats ?? [],
    {
      filtering: {
        empty: "No champions played this season",
        noMatch: "No champions match filter",
        filteringFunction(item, filteringText) {
          return !champions.get(item.id)?.name.toLowerCase().search(filteringText.toLowerCase())
        },
      },
      pagination: { pageSize: preferences.pageSize },
      sorting: {},
      selection: {},
    }
  )

  function getUserOptions() {
    return Array.from(USERS.keys()).map(u => {
      return {
        value: USERS.get(u),
        label: u
      }
    })
  }

  function getSeasonOptions() {
    const options = SEASONS
      .map(season_id => {
        return {
          value: season_id.toString(),
          label: `Season ${season_id.toString()} (${seasonData?.get(season_id)?.champion_stats.length ?? 0})`,
        }
      }
    );
    options.unshift({
      value: "-1",
      label: `All Seasons (${seasonData?.get(-1)?.champion_stats.length ?? 0})`
    })
    return options;
  }

  function getGameTypeOptions() {
    return [
      {
        value: "RANKED",
        label: "Ranked (Solo/Duo & Flex)"
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
    return <Header variant="h2" description="Who let him pick Vayne?">
      Gamers' Ranked Data
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

  function getSeasonStats() {
    return <Container 
      header={<Header variant="h3">
        Season Stats
      </Header>}
    >
      <KeyValuePairs
        columns={4}
        items={[
          {
            label: "Wins",
            value: seasonData.get(season)?.win,
          },
          {
            label: "Losses",
            value: seasonData.get(season)?.lose
          },
          {
            label: "Total",
            value: seasonData.get(season)?.play
          },
          {
            label: "Win Rate",
            value: seasonData.has(season) ? (100 * seasonData.get(season)!.win / seasonData.get(season)!.play).toFixed(2) : 0
          },
        ]}
      />
    </Container> 
  }

  function getTable() {
    return <Table 
      {...collectionProps}
      trackBy={"id"} 
      items={items} 
      columnDefinitions={getColumnDefs()} 
      columnDisplay={preferences.contentDisplay}
      header={<Header variant="h3">Champions</Header>}
      pagination={<Pagination {...paginationProps} />}
      filter={
        <TextFilter
          {...filterProps}
          countText={`${filteredItemsCount} Matches`}
          filteringAriaLabel="Filter instances"
        />
      }
      preferences={
        <CollectionPreferences
          title="Preferences"
          confirmLabel="Confirm"
          cancelLabel="Cancel"
          pageSizePreference={{
            title: "Page Size",
            options: [{value: 10, label: "10"}, {value: 25, label: "25"}, {value: 50, label: "50"}, {value: 9999999999, label: "Unlimited"}]
          }}
          contentDisplayPreference={{
            title: "Columns to display",
            options: [
              {
                id: "portrait",
                label: "Portrait",
                alwaysVisible: true,
              },
              {
                id: "name",
                label: "Name",
                alwaysVisible: true,
              },
              {
                id: "winrate",
                label: "Win Rate"
              },
              {
                id: "kda",
                label: "KDA"
              }
            ]
          }}
          preferences={preferences}
          onConfirm={({ detail }) => setPreferences(detail)}
        />
      }
    />
  }

  function getContent() {
    return <Container header={containerHeader()} >
      <SpaceBetween size="xxs">
        {error || errorVersions || errorChampions ? errorAlert(error as string) : <></>}
        <FormField label="Gamer">
          <Select options={getUserOptions()} selectedOption={selectedUser} onChange={(e) => setUser(e.detail.selectedOption.label!)} ></Select>
        </FormField>
        <FormField label="Season">
          <Select options={seasonOptions} selectedOption={selectedSeason} onChange={(e) => setShownSeason(parseInt(e.detail.selectedOption.value!))} ></Select>
        </FormField>
        <FormField label="Queue Type">
          <Select options={gameTypeOptions} selectedOption={selectedGameType} onChange={(e) => setGameType(e.detail.selectedOption.value!)} ></Select>
        </FormField>
        {getSeasonStats()}
        {getTable()}
      </SpaceBetween>
    </Container>
  }

  function getLoadingState() {
    return <Spinner />
  }

  return loading || loadingChampions || loadingVersions ? getLoadingState() : getContent();
}
