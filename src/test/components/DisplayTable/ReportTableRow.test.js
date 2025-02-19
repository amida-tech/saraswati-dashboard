import { render, screen } from '@testing-library/react';
import {
    TextRowGenerator,
    IconRowGenerator,
    ArrayRowGenerator,
    rowSelector,
    ReportTableRow
} from 'components/DisplayTable/ReportTableRow';
import '@testing-library/jest-dom';

describe('ReportTableRow.js ->', () => {
    it('TextRowGenerator(text) functions correctly', () => {
        render(<>{TextRowGenerator(text)}</>);
        assertText(text);
    });

    it('IconRowGenerator(true, extraInfo) functions correctly', () => {
        render(<>{IconRowGenerator(true, true)}</>);
        assertCompliant();
        assertIconByTestId('CheckBoxIcon');
    });

    it('IconRowGenerator(true) functions correctly', () => {
        render(<>{IconRowGenerator(true, false)}</>);
        assertIconByTestId('CheckBoxIcon');
    });

    it('IconRowGenerator(false, extraInfo) functions correctly', () => {
        render(<>{IconRowGenerator(false, true)}</>);
        assertNotCompliant();
        assertIconByTestId('DisabledByDefaultRoundedIcon');
    });

    it('IconRowGenerator(false) functions correctly', () => {
        render(<>{IconRowGenerator(false, false)}</>);
        assertIconByTestId('DisabledByDefaultRoundedIcon');
    });

    it('ArrayRowGenerator(info, true) functions correctly', () => {
        render(<>{ArrayRowGenerator(text, true)}</>);
        assertText(text);
        assertIconByTestId('CheckCircleIcon');
    });

    it('ArrayRowGenerator(info, false) functions correctly', () => {
        render(<>{ArrayRowGenerator(text, false)}</>);
        assertText(text);
        screen.debug();
    });

    // JF-TODO: Continue working on tests for Report table row

    // it('rowSelector(rowDataItem, fieldInfo) functions correctly', () => {
    //     render(<>{rowSelector(rowDataItem(text), fieldInfo)}</>);

    //     screen.debug();
    // });
});
const fieldInfo = () => {
    return { key: 'value' };
};
const rowDataItem = (input) => {
    value: input;
};
function assertText(text) {
    const renderedText = screen.getByText(text);
    expect(renderedText).toBeInTheDocument();
}

function assertCompliant() {
    const compliant = screen.getByText('Compliant');
    expect(compliant).toBeInTheDocument();
}

function assertNotCompliant() {
    const compliant = screen.getByText('Not Compliant');
    expect(compliant).toBeInTheDocument();
}

function assertIconByTestId(testId) {
    const icon = screen.getByTestId(testId);
    expect(icon).toBeInTheDocument();
}

function assertCheckBoxIcon() {
    const checkboxIcon = screen.getByTestId('CheckBoxIcon');
    expect(checkboxIcon).toBeInTheDocument();
}

function assertDisabledIcon() {
    const disabledIcon = screen.getByTestId('DisabledByDefaultRoundedIcon');
    expect(disabledIcon).toBeInTheDocument;
}

const text = 'textz';
