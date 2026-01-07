import type { FC } from 'react';
import { createElement, useEffect, useRef } from 'react';

interface InnerHtmlProps {
  html: string;
  tagName?: string;
  allowRerender?: boolean;
}

// based on https://github.com/christo-pr/dangerously-set-html-content
export const InnerHtml: FC<InnerHtmlProps> = ({
  html,
  tagName,
  allowRerender,
  ...rest
}) => {
  const elementRef = useRef<HTMLElement | null>(null);
  const isFirstRender = useRef<boolean>(true);

  useEffect(() => {
    if (!html || !elementRef.current) {
      throw new Error("InnerHtml `html` prop can't be null");
    }
    if (!isFirstRender.current) {
      return;
    }
    isFirstRender.current = Boolean(allowRerender);

    // Create a 'tiny' document and parse the html string
    const slotHtml = document.createRange().createContextualFragment(html);
    // Clear the container
    elementRef.current.innerHTML = '';
    // Append the new content
    elementRef.current.appendChild(slotHtml);
  }, [html, elementRef]);

  return createElement(tagName ?? 'div', { ...rest, ref: elementRef });
};
