import { render, screen } from "@testing-library/react";
import { SeasonDataTable } from "../../components/SeasonDataTable";
import { TestContextProvider } from "../TestContextProvider";

describe('Season Data Table', () => {
  test('renders table', () => {
    render(<TestContextProvider>
        <SeasonDataTable />
      </TestContextProvider>);
    // TODO: Mock api call and table load
  });
});
