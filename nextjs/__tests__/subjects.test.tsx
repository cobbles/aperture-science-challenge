/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from '@testing-library/react'
import axios from 'axios';
import { getPage } from 'next-page-tester';
import MockAdapter from 'axios-mock-adapter';
import * as nextRouter from 'next/router';
import SubjectsMock, { subjectsResponse } from '../__mocks__/subjectsMock'

// @ts-ignore: misuse of typecast for tests only
nextRouter.useRouter = jest.fn();
// @ts-ignore: misuse of typecast for tests only
nextRouter.useRouter.mockImplementation(() => ({
  route: '/',
  push: jest.fn()
}));

var mock = new MockAdapter(axios);

describe('Subjects page, no session cookie', () => {

  beforeEach(async () => {
    const { render } = await getPage({
      route: '/subjects',
    });

    await render();
  })
  it('renders a heading', () => {
    expect(screen.getByText('Testing Subjects')).toBeInTheDocument();
  });
  it('renders a skeleton', () => {
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
  });
});

describe('Subjects page, with session cookie', () => {

  const setup = async function(cookie:string, mockStatus: number, mockResponse?: { data: subjectsResponse } | { message: string }) {
    document.cookie = `XSRF-TOKEN=${cookie}`;
      const { render } = await getPage({
        route: '/subjects',
    });
    mock.onPost(`http://${process.env.NEXT_PUBLIC_BASE_API}/graphql`).reply(mockStatus, mockResponse);
    render();
  }

  it('requests and displays subjects successfully', async () => {
    await setup('abc', 200, SubjectsMock)
    await waitFor(() => {
      expect(screen.getByTestId('subjects-table')).toBeInTheDocument();
    });
  });

  it('fails subject request and shows error message, bad token', async () => {
    await setup('abc', 419, {
      message: "CSRF token mismatch."
    });
    await waitFor(() => {
      expect(screen.getByTestId('error-msg')).toBeInTheDocument();
    });
  });

  it('fails subject request and shows error message, bad request', async () => {
    await setup('abc', 400);
    await waitFor(() => {
      expect(screen.getByTestId('error-msg')).toBeInTheDocument();
    });
  });

})

describe('Subjects form, with session cookie', () => {

  const setup = async function(cookie:string, mockStatus: number, mockResponse?: { data: subjectsResponse } | { message: string }) {
    document.cookie = `XSRF-TOKEN=${cookie}`;
      const { render } = await getPage({
        route: '/subjects',
    });
    mock.onPost(`http://${process.env.NEXT_PUBLIC_BASE_API}/graphql`).reply(mockStatus, mockResponse);
    render();
  }

  it('subject form create button is displayed', async () => {
    await setup('abc', 200, SubjectsMock)
    await waitFor(() => {
      expect(screen.getByTestId('subject-form-btn')).toBeInTheDocument();
    });
  });

  it('clicking subject create form button displays subject form', async () => {
    await setup('abc', 200, SubjectsMock)
    screen.getByTestId('subject-form-btn').click()
    await waitFor(() => {
      expect(screen.getByTestId('subject-form')).toBeInTheDocument();
    });
  });

  it('clicking submit on subject form hides the form and shows the subject table', async () => {
    await setup('abc', 200, SubjectsMock)
    screen.getByTestId('subject-form-btn').click()
    screen.getByTestId('subject-form-submit-btn').click()
    await waitFor(() => {
      expect(screen.getByTestId('subjects-table')).toBeInTheDocument();
    });
  });

})
