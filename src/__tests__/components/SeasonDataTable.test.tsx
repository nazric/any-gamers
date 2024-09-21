import { render, screen } from "@testing-library/react";
import { SeasonDataTable } from "../../components/SeasonDataTable";

describe('Season Data Table', () => {
  test('renders table', () => {
    render(<SeasonDataTable />);
    // TODO: Mock api call and table load
  });
});
