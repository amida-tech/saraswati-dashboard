import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Register from 'views/auth/Register';

describe('Register.js', () => {
    it('renders correctly', () => {
        // Render the regsiter component
        render(<Register />);

        // Identify and click the link
        const link = screen.getByRole('link');
        fireEvent.click(link);

        // Assert that there are two text inputs in the document
        const inputs = screen.getAllByRole('textbox');
        expect(inputs).toHaveLength(2);

        // Identify and click the buttons
        const btns = screen.getAllByRole('button');
        const createBtn = btns[btns.length - 1]
        expect(createBtn).toBeInTheDocument();
    });
});
