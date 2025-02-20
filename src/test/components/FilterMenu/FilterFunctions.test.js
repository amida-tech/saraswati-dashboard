import {
    setPercentageRange,
    setDomainsOfCare,
    setStarRating,
    setNCQAAccreditationBonus,
    setMeasureTypes,
    setSubMeasures
} from 'components/FilterMenu/FilterFunctions';
import { rowData } from 'test/data/DemoData';

describe('FilterFunctions.js -> ', () => {
    it('setPercentageRange passes data through', () => {
        expect(setPercentageRange(rowData)).toStrictEqual(rowData);
    });

    it('setDomainsOfCare passes data through', () => {
        expect(setDomainsOfCare(rowData)).toStrictEqual(rowData);
    });

    it('setStarRating passes data through', () => {
        expect(setStarRating(rowData)).toStrictEqual(rowData);
    });

    it('setNCQAAccreditationBonus passes data through', () => {
        expect(setNCQAAccreditationBonus(rowData)).toStrictEqual(rowData);
    });

    it('setMeasureTypes passes data through', () => {
        expect(setMeasureTypes(rowData)).toStrictEqual(rowData);
    });

    it('setSubMeasures passes data through', () => {
        expect(setSubMeasures(rowData)).toStrictEqual(rowData);
    });
});
