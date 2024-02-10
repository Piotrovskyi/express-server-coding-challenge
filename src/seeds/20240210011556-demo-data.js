const { parse } = require('csv-parse/sync');
const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.join(__filename, '../the-tate-collection.csv')).toString();

module.exports = {
  async up(queryInterface) {
    const data = parse(input, {
      columns: true,
      skip_empty_lines: true,
      delimiter: ';',
    });

    await queryInterface.bulkInsert('Arts', data.map((art) => ({
      title: art.title,
      artist: art.artist,
      year: art.year ? parseInt(art.year, 10) : null,
    })), {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('arts', null, {});
  },
};
