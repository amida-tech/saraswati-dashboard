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
    });

    it('rowSelector(rowDataItem, fieldInfo) functions correctly', () => {
        render(<>{rowSelector(rowDataItem, fieldInfo('text'))}</>);
        assertText(text);
    });

    it('rowSelector(rowDataItem, fieldInfo) functions correctly', () => {
        render(<>{rowSelector(rowDataItem, fieldInfo('icon'))}</>);
        assertIconByTestId('DisabledByDefaultRoundedIcon');
        assertNotCompliant();
    });

    it('rowSelector(rowDataItem, fieldInfo) functions correctly', () => {
        render(<>{rowSelector(rowDataItem, fieldInfo('array'))}</>);
        assertText(text);
    });

    it('ReportTableRow({ rowDataItem, headerInfo }) functions correctly', () => {
        render(<>{ReportTableRow(rowDataItem, headerInfo)}</>);
        const mainDiv = document.body.firstChild
        const childDiv = mainDiv.firstChild;
        expect(childDiv).toHaveClass('report-table-row MuiBox-root css-0')
    });
});

const fieldInfo = (rowType) => {
    return { key: 0, extraInfo: true, rowType: rowType, flexBasis: '100px' };
};

const headerInfo = [fieldInfo('text'), fieldInfo('icon')];

const text = 'textz';

const rowDataItem = [text, text, text];

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
