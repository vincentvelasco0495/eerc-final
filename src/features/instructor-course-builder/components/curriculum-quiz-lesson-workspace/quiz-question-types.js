export const QUIZ_QUESTION_TYPES = [
  { value: 'single_choice', label: 'Standard question' },
  { value: 'simulation_diagram', label: 'Simulation (problem & solution images)' },
];

export function isSimulationDiagramQuestion(questionType) {
  return questionType === 'simulation_diagram';
}
