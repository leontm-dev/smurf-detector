import ReactDOM from "react-dom/client";
import ContentApp from "./ContentApp";
import cssHref from "./styles.css?url";

function waitForElement(selector: string): Promise<Element> {
  const existing = document.querySelector(selector);
  if (existing) return Promise.resolve(existing);
  return new Promise((resolve) => {
    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) {
        observer.disconnect();
        resolve(el);
      }
    });
    observer.observe(document.documentElement || document.body, {
      childList: true,
      subtree: true,
    });
  });
}
export default function initial() {
  const rootDiv = document.createElement("div");
  rootDiv.setAttribute("data-extension-root", "true");
  const shadowRoot = rootDiv.attachShadow({ mode: "open" });
  const selector = "div.v3-card.segment-stats";
  const styleElement = document.createElement("style");
  shadowRoot.appendChild(styleElement);
  fetchCSS().then((css) => (styleElement.textContent = css));
  waitForElement(selector).then((target) => {
    target.insertBefore(rootDiv, target.childNodes[1]);
    const mountingPoint = ReactDOM.createRoot(shadowRoot);
    mountingPoint.render(
      <div className="content_script">
        <ContentApp />
      </div>,
    );

    return () => {
      mountingPoint.unmount();
      rootDiv.remove();
    };
  });
}

async function fetchCSS() {
  const href =
    (cssHref as unknown as { default?: string }).default ||
    (cssHref as unknown as string);
  const response = await fetch(href);
  const text = await response.text();
  return response.ok ? text : Promise.reject(text);
}
