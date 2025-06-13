import { useState, useEffect } from "react";
import { getPreferenceValues } from "@raycast/api";
import { 
  ImageResult, 
  SearchOptions, 
  SearchResponse, 
  SearchResult, 
  PaginationInfo
} from "../types";

// Maximum page size for Google API
const PAGE_SIZE = 8;

// Custom hook for Google Image Search API
export function useGoogleImageSearch({ term, limit = 8 }: SearchOptions): SearchResult {
  const [data, setData] = useState<ImageResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [nextStartIndex, setNextStartIndex] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  
  // Get API key and Search Engine ID from Raycast preferences
  const { apiKey, searchEngineId } = getPreferenceValues<Preferences>();
  
  // Function to fetch images
  async function fetchImages(searchTerm: string, startIndex: number) {
    if (!searchTerm.trim()) {
      setData([]);
      setIsLoading(false);
      setError(undefined);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Use the smaller of limit or PAGE_SIZE (Google API max)
      const resultsPerPage = Math.min(limit, PAGE_SIZE);
      
      // Build the URL for Google's Custom Search API
      const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(searchTerm)}&searchType=image&start=${startIndex}&num=${resultsPerPage}`;
      
      const response = await fetch(url);
      console.log(response);
      
      if (!response.ok) {
        setError(`Error: ${response.status} ${response.statusText}`);
        setIsLoading(false);
        return;
      }
      
      const responseData = await response.json() as SearchResponse;
      
      if (responseData.items && responseData.items.length > 0) {
        // Calculate next start index for pagination
        const newStartIndex = startIndex + responseData.items.length;
        
        // Update data
        setData(prev => startIndex === 1 ? (responseData.items || []) : [...prev, ...(responseData.items || [])]);
        
        // Check if there are more results
        const totalResults = responseData.searchInformation?.totalResults
          ? parseInt(responseData.searchInformation.totalResults, 8)
          : 0;
        
        const moreAvailable = (newStartIndex <= 100 && 
                             responseData.items.length === resultsPerPage &&
                             newStartIndex < totalResults);
        
        setHasMore(moreAvailable);
        setNextStartIndex(newStartIndex);
        setError(undefined);
      } else {
        if (startIndex === 1) {
          setData([]);
        }
        setHasMore(false);
        setError(responseData.error?.message || "No results found");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  }
  
  // Load more function for pagination
  function loadMore() {
    if (hasMore && !isLoading) {
      fetchImages(term, nextStartIndex);
    }
  }
  
  // Initial search effect
  useEffect(() => {
    setNextStartIndex(1);
    fetchImages(term, 1);
  }, [term]);
  
  // Create pagination info
  const pagination: PaginationInfo = {
    pageSize: PAGE_SIZE,
    hasMore,
    onLoadMore: loadMore,
    startIndex: nextStartIndex,
    totalResults: 0,
    isLoadingMore: isLoading && data.length > 0
  };
  
  return {
    data,
    isLoading,
    error,
    pagination
  };
}
