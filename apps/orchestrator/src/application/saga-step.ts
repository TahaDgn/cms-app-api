export class SagaStep<Context> {
  constructor(
    public readonly name: string,
    public readonly action: (ctx: Context) => Promise<void>,
    public readonly compensation: (ctx: Context) => Promise<void>,
  ) {}
}
