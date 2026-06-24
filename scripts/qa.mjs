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
  const badImageQuestions = unit.questions.filter((question) => {
    if (question.assets.length === 0) return false;
    const label = question.assets[0].label;
    const answer = question.choices[question.answerIndex] || '';
    return (
      !question.stem.includes(label) ||
      !question.source.includes(label) ||
      !answer.includes(label) ||
      question.type !== '자료 해석'
    );
  });

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
  if (badImageQuestions.length > 0) {
    duplicateReports.push(`${grade.label} ${unit.title}: image-question alignment ${badImageQuestions.length}`);
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
