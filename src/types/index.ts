// Types and interfaces for Google Image Search extension

export interface Preferences {
    apiKey: string;
    searchEngineId: string;
  }
  
  export interface ImageResult {
    link: string;
    title: string;
    mime?: string;
    fileFormat?: string;
    image: {
      thumbnailLink: string;
      contextLink: string;
    };
  }
  
  export interface SearchResponse {
    items?: ImageResult[];
    error?: {
      message: string;
    };
    searchInformation?: {
      totalResults: string;
    };
  }
  
  export interface SearchOptions {
    term: string;
    limit?: number;
  }
  
  // Modified to match Raycast Grid component's expected pagination format
  export interface PaginationInfo {
    pageSize: number;
    hasMore: boolean;
    onLoadMore: () => void;
    // Additional properties for our own use
    startIndex: number;
    totalResults: number;
    isLoadingMore: boolean;
  }
  
  export interface SearchResult {
    data: ImageResult[];
    isLoading: boolean;
    error: string | undefined;
    pagination: PaginationInfo;
  }
  