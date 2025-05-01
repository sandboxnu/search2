"use client";

import { ResultCard } from "./ResultCard";
import { useParams, useSearchParams } from "next/navigation";
import {
  memo,
  Suspense,
  use,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
} from "react";

interface searchResult {
  name: string;
  courseNumber: string;
  subject: string;
  minCredits: number;
  maxCredits: number;
  sectionsWithSeats: number;
  totalSections: number;
  nupaths: string[];
}

export function SearchResults() {
  const params = useSearchParams();
  const deferred = useDeferredValue(params.toString());
  const stale = deferred !== params.toString();

  return (
    <div className="bg-neu2 flex h-[calc(100vh-108px)] flex-col overflow-y-scroll px-2 py-2 xl:h-[calc(100vh-56px)]">
      <div className={stale ? "opacity-80" : ""}>
        <Suspense fallback={<p>loading.......</p>}>
          <ResultsList params={deferred} />
        </Suspense>
      </div>
    </div>
  );
}

// this acts as a single value cache for the data fetcher - the fetch promise has to be stored outside
// the react tree since otherwise they would be recreated on every rerender
let cacheKey = "!";
let cachePromise: Promise<unknown> = new Promise((r) => r([]));

function fetcher<T>(key: string, p: () => string) {
  if (!Object.is(cacheKey, key)) {
    cacheKey = key;
    // if window is undefined, then we are ssr and thus cannot do a relative fetch
    if (typeof window !== "undefined") {
      // PERF: next caching on the fetch
      cachePromise = fetch(p()).then((r) => r.json());
    }
  }

  return cachePromise as Promise<T>;
}

// this is explicitly memoized a) because it is a little heavy to render and b)
// (more importantly) the parent component rerenders too frequently with
// the searchParams and the memo shields the extra fetching requests
const ResultsList = memo(function ResultsList(props: { params: string }) {
  const { term, course } = useParams();
  const [displayCount, setDisplayCount] = useState(10);
  const loaderRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const allResults = use(
    fetcher<searchResult[]>(props.params + term?.toString(), () => {
      const searchP = new URLSearchParams(props.params);
      searchP.set("term", term?.toString() ?? "");
      return `/api/search?${searchP.toString()}`;
    }),
  );

  if (allResults.length < 0) {
    return <p>No results</p>;
  }

  useEffect(() => {
    if (!loaderRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting && displayCount < allResults.length) {
          setTimeout(() => {
            setDisplayCount((prev) => Math.min(prev + 5, allResults.length));
          }, 500); // Simulate a delay
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [displayCount, allResults.length]);

  useEffect(() => {
    setDisplayCount(10);

    // Find the scrollable container (parent div with overflow-y-scroll)
    const scrollContainer = document.querySelector(
      ".flex-col.overflow-y-scroll",
    );
    if (scrollContainer instanceof HTMLElement) {
      console.log("DENNIS SCROLLING TO TOP");
      scrollContainer.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      console.log("Failed to find scroll container");
    }
  }, [props.params, term]);

  return (
    <ul className="space-y-4" ref={listRef}>
      {allResults.map((result, index) => {
        if (index > displayCount) return null;
        return (
          <ResultCard
            key={index}
            result={result}
            link={`/catalog/${term?.toString()}/${result.subject}%20${result.courseNumber}?${props.params}`}
            active={
              decodeURIComponent(course?.toString() ?? "") ===
              result.subject + " " + result.courseNumber
            }
          />
        );
      })}

      {displayCount < allResults.length && (
        <div ref={loaderRef}>
          <p>Loading more results...</p>
        </div>
      )}

      <div>
        Showing {Math.min(allResults.length, displayCount)} of{" "}
        {allResults.length} results
      </div>
    </ul>
  );
});
