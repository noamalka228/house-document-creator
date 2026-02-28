// TOut allows us to support multiple output formats
import { IFormatter } from './IFormatter';

export interface IExportable<TOut> {
  exportData(): Record<string, any>;
  export(formatter: IFormatter<TOut>): TOut;
}
