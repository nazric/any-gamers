import { render, screen } from '@testing-library/react';
import App from '../App';

describe('Any Gamers App', () => {
  test('renders app', () => {
    render(<App />);
    const linkElement = screen.getByText('breadcrumbs.text.home');
    expect(linkElement).toBeInTheDocument();
  });
});
