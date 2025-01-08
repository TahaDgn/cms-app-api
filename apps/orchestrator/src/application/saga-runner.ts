import { SagaStep } from './saga-step';

export async function runSaga<Context>(
  steps: SagaStep<Context>[],
  context: Context,
): Promise<void> {
  const completedSteps: SagaStep<Context>[] = [];
  try {
    for (const step of steps) {
      await step.action(context);
      completedSteps.push(step);
    }
  } catch (error) {
    for (const step of completedSteps.reverse()) {
      try {
        await step.compensation(context);
      } catch (compError) {
        console.error(
          `Compensation failed for step: ${step.name}, Error: `,
          compError,
        );
      }
    }
    throw error;
  }
}
