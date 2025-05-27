import {
  fireEvent, render, screen,
} from '@testing-library/react';
import {
  BrowserRouter,
} from 'react-router-dom';
import Login from '../../../views/auth/Login';
import env from '../../../env';

describe('Login', () => {
  it('Renders on Load', () => {
    render(<BrowserRouter><Login /></BrowserRouter>);
  });
});
describe('Links render as expected', () => {
  if (env.REACT_APP_MVP_SETTING === true) {
    it('2 Links render on page', () => {
      render(<BrowserRouter><Login /></BrowserRouter>);
      const linksOnPage = document.getElementsByTagName('a');
      expect(linksOnPage.length).toBe(2);
    });
    it('"Sign Up" link renders to page with correct text and href', () => {
      render(<BrowserRouter><Login /></BrowserRouter>);
      const linksOnPage = document.getElementsByTagName('a');
      const signUpLink = linksOnPage[0];
      expect(signUpLink.href.includes('/welcome')).toBeTruthy();
      expect(signUpLink.innerHTML).toBe('Sign Up');
    });
    it('"Forgot Password" link renders to page with correct text and href', () => {
      render(<BrowserRouter><Login /></BrowserRouter>);
      const linksOnPage = document.getElementsByTagName('a');
      const forgotPasswordLink = linksOnPage[1];
      expect(forgotPasswordLink.href.includes('#pablo')).toBeTruthy();
      expect(forgotPasswordLink.innerHTML).toBe('Forgot password');
    });
  } else {
    it('One Link render on page', () => {
      render(<BrowserRouter><Login /></BrowserRouter>);
      const linksOnPage = document.getElementsByTagName('a');
      expect(linksOnPage.length).toBe(1);
    });
    it('"Forgot Password" link renders to page with correct text and href', () => {
      render(<BrowserRouter><Login /></BrowserRouter>);
      const linksOnPage = document.getElementsByTagName('a');
      const forgotPasswordLink = linksOnPage[0];
      expect(forgotPasswordLink.href.includes('#pablo')).toBeTruthy();
      expect(forgotPasswordLink.innerHTML).toBe('Forgot password');
    });
  }
});

describe('Labels render as expected', () => {
  it('2 Labels render on page', () => {
    render(<BrowserRouter><Login /></BrowserRouter>);
    const labelsOnPage = document.getElementsByTagName('label');
    expect(labelsOnPage.length).toBe(2);
  });
  it('"Email" label renders to page with correct placeholder', () => {
    render(<BrowserRouter><Login /></BrowserRouter>);
    const labelsOnPage = document.getElementsByTagName('label');
    const emailLabel = labelsOnPage[0];
    expect(emailLabel.innerHTML.includes('Email')).toBe(true);
  });
  it('"Password" label renders to page with correct placeholder', () => {
    render(<BrowserRouter><Login /></BrowserRouter>);
    const labelsOnPage = document.getElementsByTagName('label');
    const passwordLabel = labelsOnPage[1];

    expect(passwordLabel.innerHTML.includes('Password')).toBe(true);
  });
});

describe('Inputs render as expected', () => {
  it('2 Inputs render on page', () => {
    render(<BrowserRouter><Login /></BrowserRouter>);
    const inputsOnPage = document.getElementsByTagName('input');
    expect(inputsOnPage.length).toBe(2);
  });
  it('"Email" input renders to page with correct text', () => {
    render(<BrowserRouter><Login /></BrowserRouter>);
    const inputsOnPage = document.getElementsByTagName('input');

    const emailLabel = inputsOnPage[0];
    expect(emailLabel.placeholder).toBe('Email address');
  });
  it('"Password" input renders to page with correct text', () => {
    render(<BrowserRouter><Login /></BrowserRouter>);
    const inputsOnPage = document.getElementsByTagName('input');
    const passwordLabel = inputsOnPage[1];

    expect(passwordLabel.placeholder).toBe('Password');
  });
});

describe('Button renders as expected', () => {
  it('Number of buttons on DOM is two', () => {
    render(<BrowserRouter><Login /></BrowserRouter>);
    const buttonsOnPage = document.getElementsByTagName('button');
    expect(buttonsOnPage.length).toBe(2);
  });

  it('Google button renders with correct text', () => {
    render(<BrowserRouter><Login /></BrowserRouter>);
    const googleButton = screen.getByRole('button', { name: 'google.svg Sign in with Google' });
    expect(googleButton.textContent.includes('Sign in with Google')).toBe(true);
  });

  it('Login button renders with correct text', () => {
    render(<BrowserRouter><Login /></BrowserRouter>);
    const loginButton = screen.getByRole('button', { name: 'Login' });
    expect(loginButton.textContent.includes('Login')).toBe(true);
  });
});
if (env.REACT_APP_MVP_SETTING === false) {
  describe('Sign up link renders and navigates as expected', () => {
    it("Sign up link navigates to '/register'", () => {
      render(<BrowserRouter><Login /></BrowserRouter>);
      const registerLink = screen.getByRole('link', { name: 'Sign Up' });
      expect(registerLink.hasAttribute('href', '/register')).toBe(true);
    });
  });
}

describe('Google OAuth logging in', () => {
  it('Button is clickable', () => {
    window.HTMLFormElement.prototype.submit = ((e) => e);
    render(<BrowserRouter><Login /></BrowserRouter>);
    const googleLogin = screen.getByRole('button', { name: 'google.svg Sign in with Google' });
    expect(fireEvent.click(googleLogin)).toBe(true);
  });
});
