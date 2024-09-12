import { Alert, Container, Header, Spinner } from "@cloudscape-design/components";
import { useGetSeasonDataQuery } from "../api/opgg";

const REGION = "na";
const USER = "mGI_ElabdzhqQ1TkTeoaiMbdAvUF86kTXH2nFlXe69GbPTU";
const GAME_TYPE = "RANKED";
const SEASON_ID = 25;

export const SeasonDataTable = () => {
  const {data, error, isLoading} = useGetSeasonDataQuery({
    region: REGION,
    user: USER,
    game_type: GAME_TYPE,
    season_id: SEASON_ID,
  });

  function containerHeader() {
    return <Header variant="h2" description="seasonData.container.description">
      seasonData.container.title
    </Header>
  }

  function errorAlert(error: string) {
    return <Alert type="error">
      {error}
    </Alert>
  }

  function getContent() {
    return <Container header={containerHeader()} >
      {error ? errorAlert(error as string) : <></>}
      {JSON.stringify(data)}
    </Container>
  }

  function getLoadingState() {
    return <Spinner />
  }

  return isLoading ? getLoadingState() : getContent();
}
