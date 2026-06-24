import { grades, totalQuestionCount } from '../src/data/curriculum.js';

const units = grades.flatMap((grade) => grade.units.map((unit) => ({ grade, unit })));
const duplicateReports = [];
let unitsWithImages = 0;
let imageQuestionCount = 0;

for (const { grade, unit } of units) {
  const stems = new Set(unit.questions.map((question) => question.stem));
  const answers = new Set(unit.questions.map((question) => question.choices[question.answerIndex]));
  const minimumUnique = Math.min(unit.questions.length, 8);
  const imageCount = unit.questions.filter((question) => question.assets.length > 0).length;

  if (stems.size < minimumUnique) {
    duplicateReports.push(`${grade.label} ${unit.title}: question stems ${stems.size}/${unit.questions.length}`);
  }
  if (answers.size < minimumUnique) {
    duplicateReports.push(`${grade.label} ${unit.title}: answers ${answers.size}/${unit.questions.length}`);
  }
  if (imageCount > 0) {
    unitsWithImages += 1;
    imageQuestionCount += imageCount;
  }
}

if (duplicateReports.length > 0) {
  console.error(duplicateReports.join('\n'));
  process.exit(1);
}

if (totalQuestionCount < 500 || unitsWithImages < 20 || imageQuestionCount < 100) {
  console.error(
    JSON.stringify({ totalQuestionCount, units: units.length, unitsWithImages, imageQuestionCount }, null, 2),
  );
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      totalQuestionCount,
      units: units.length,
      duplicateReportCount: duplicateReports.length,
      unitsWithImages,
      imageQuestionCount,
    },
    null,
    2,
  ),
);
