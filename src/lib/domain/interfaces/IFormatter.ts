// TOut allows us to support multiple output formats
export interface IFormatter<TOut> {
    format(data: Record<string, any>): TOut;
    formatHeaders?(data: Record<string, any>): TOut;
}
