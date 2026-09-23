const { expect } = require('chai');
const { buildSearchQuery } = require('../routes/searchRoutes');

describe('buildSearchQuery', () => {
  it('builds a case-insensitive name search and category filter', () => {
    const query = buildSearchQuery({ name: 'toy', category: 'kids', condition: 'new', age_years: '5' });

    expect(query).to.deep.equal({
      name: { $regex: 'toy', $options: 'i' },
      category: 'kids',
      condition: 'new',
      age_years: { $lte: 5 }
    });
  });

  it('ignores blank values and keeps the filter empty when no params are passed', () => {
    const query = buildSearchQuery({});
    expect(query).to.deep.equal({});
  });
});
