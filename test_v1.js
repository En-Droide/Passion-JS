import fs from 'node:fs';
import csv from 'csv-parser';
import * as R from 'ramda';
import dayjs from 'dayjs';

const csv_file = async (filePath) =>
  new Promise((resolve) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        resolve(results);
        console.log(results);
      });
  });

const lengthLessThan6 = R.pipe(R.length, R.lt(R.__, 6));

const getDate = R.pipe(
  R.pluck('posting_date'),
  R.map(R.replace(/\D/g, '-')),
  R.map(R.when(lengthLessThan6, R.concat('0')))
);

const getDayOfWeek = R.pipe(
  getDate,
  R.map((date) => {
    const dayjsDate = dayjs(date, 'MM-DD-YY');
    return dayjsDate.format('dddd');
  })
);

const countDaysOfWeek = R.pipe(getDayOfWeek, R.countBy(R.identity));

const process = R.pipeWith(R.andThen, [
  csv_file,
  countDaysOfWeek,
  R.tap(console.log)
]);

process('./voitures.csv');
