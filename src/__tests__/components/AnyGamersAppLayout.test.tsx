import { render, screen } from "@testing-library/react";
import { AnyGamersAppLayout } from "../../components/AnyGamersAppLayout";

describe('Any Gamers App Layout', () => {
  test('renders app layout', () => {
    render(<AnyGamersAppLayout header={'Test Header'} breadcrumbItems={[]} />);
    const linkElement = screen.getByText('Test Header');
    expect(linkElement).toBeInTheDocument();
  });
});
