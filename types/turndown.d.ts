declare module 'turndown' {
  interface TurndownOptions {
    headingStyle?: 'setext' | 'atx';
    codeBlockStyle?: 'indented' | 'fenced';
  }

  class TurndownService {
    constructor(options?: TurndownOptions);
    use(plugin: any): void;
    turndown(html: string): string;
  }

  export default TurndownService;
}

declare module 'turndown-plugin-gfm' {
  export function gfm(service: any): void;
}

