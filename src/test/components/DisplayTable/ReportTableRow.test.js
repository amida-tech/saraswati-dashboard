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
    // TextRowGenerator function tests
    it('TextRowGenerator(text) functions correctly', () => {
        render(<>{TextRowGenerator(text)}</>);
        assertText(text);
    });

    // IconRowGenerator function tests
    it('IconRowGenerator(true, extraInfo) functions correctly', () => {
        render(<>{IconRowGenerator(true, true)}</>);
        assertText('Compliant')
        assertIconByTestId('CheckBoxIcon');
    });

    it('IconRowGenerator(true) functions correctly', () => {
        render(<>{IconRowGenerator(true, false)}</>);
        assertIconByTestId('CheckBoxIcon');
    });

    it('IconRowGenerator(false, extraInfo) functions correctly', () => {
        render(<>{IconRowGenerator(false, true)}</>);
        
        assertText('Not Compliant')
        assertIconByTestId('DisabledByDefaultRoundedIcon');
    });

    it('IconRowGenerator(false) functions correctly', () => {
        render(<>{IconRowGenerator(false, false)}</>);
        assertIconByTestId('DisabledByDefaultRoundedIcon');
    });

    // ArrayRowGenerator function tests
    it('ArrayRowGenerator(info, true) functions correctly', () => {
        render(<>{ArrayRowGenerator(text, true)}</>);
        assertText(text);
        assertIconByTestId('CheckCircleIcon');
    });

    it('ArrayRowGenerator(info, false) functions correctly', () => {
        render(<>{ArrayRowGenerator(text, false)}</>);
        assertText(text);
    });

    // rowSelector function tests
    it('rowSelector(rowDataItem, fieldInfo) functions correctly', () => {
        render(<>{rowSelector(rowDataItem, fieldInfo('text'))}</>);
        assertText(text);
    });

    it('rowSelector(rowDataItem, fieldInfo) functions correctly', () => {
        render(<>{rowSelector(rowDataItem, fieldInfo('icon'))}</>);
        assertIconByTestId('DisabledByDefaultRoundedIcon');
        assertText('Not Compliant')
    });

    it('rowSelector(rowDataItem, fieldInfo) functions correctly', () => {
        render(<>{rowSelector(rowDataItem, fieldInfo('array'))}</>);
        assertText(text);
    });

    // ReportTableRow function tests
    it('ReportTableRow({ rowDataItem, headerInfo }) functions correctly', () => {
        render(<>{ReportTableRow(rowDataItem, headerInfo)}</>);
        const mainDiv = document.body.firstChild
        const childDiv = mainDiv.firstChild;
        expect(childDiv).toHaveClass('report-table-row MuiBox-root css-0')
    });
});

// Field info object
const fieldInfo = (rowType) => {
    return { key: 0, extraInfo: true, rowType: rowType, flexBasis: '100px' };
};

// Header info array
const headerInfo = [fieldInfo('text'), fieldInfo('icon')];

// Mock text
const text = 'textz';

// Mock rowDataItem array
const rowDataItem = [text, text, text];

// Assert the given text appears in the document
function assertText(text) {
    const renderedText = screen.getByText(text);
    expect(renderedText).toBeInTheDocument();
}

// Assert the given icon appears in the document
function assertIconByTestId(testId) {
    const icon = screen.getByTestId(testId);
    expect(icon).toBeInTheDocument();
}
