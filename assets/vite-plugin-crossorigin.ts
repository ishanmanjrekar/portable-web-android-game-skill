import { Plugin } from 'vite';

export function stripCrossoriginPlugin(): Plugin {
  return {
    name: 'strip-crossorigin',
    transformIndexHtml(html: string) {
      // Itch.io sandbox blocks resources with crossorigin attributes.
      // Strips crossorigin from both <script> and <link> tags.
      return html
        .replace(/<script(.*?)crossorigin(.*?)>/gi, '<script$1$2>')
        .replace(/<link(.*?)crossorigin(.*?)>/gi, '<link$1$2>');
    }
  };
}
