export const selectAppState = (state) => state.app;
export const selectLmsFlash = (state) => state.app?.flash ?? null;
export const selectLmsLoading = (state) => state.app?.loading ?? null;
export const selectIsBootstrapping = () => false;
export const selectIsAnyLmsMutationPending = (state) => {
  const loading = state.app?.loading;
  if (!loading) return false;
  return Object.values(loading).some(Boolean);
};

export const selectQuizzesState = (state) => state.quizzes;
export const selectQuestionSets = (state) => state.quizzes.questionSets;

export const selectLmsResources = (state) => state.app?.resources ?? {};
export const selectLmsResourceByKey = (state, key) => {
  const resources = selectLmsResources(state);
  return resources[String(key ?? '').trim()] ?? null;
};

export const selectLmsCommands = (state) => state.app?.commands ?? {};
export const selectLmsCommandByName = (state, name) => {
  const commands = selectLmsCommands(state);
  return commands[String(name ?? '').trim()] ?? null;
};
