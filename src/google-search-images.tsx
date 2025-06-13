import { Action, ActionPanel, Grid } from "@raycast/api";
import { useState } from "react";

// Import custom hooks
import { useGoogleImageSearch } from "./hooks/useGoogleImageSearch";

// Import utilities
import { downloadImage, copyImageToClipboard } from "./utils/imageUtils";

export default function Command() {
  // Track search text
  const [searchText, setSearchText] = useState("");
  
  // Use our custom hook for Google Image Search with pagination
  const { isLoading, data: imageResults, pagination, error } = useGoogleImageSearch({
    term: searchText,
    limit: 8 // Maximum allowed by Google API
  });

  // console.log(pagination)
  
  return (
    <Grid
      columns={4}
      filtering={true}
      onSearchTextChange={setSearchText}
      searchText={searchText}
      isLoading={isLoading}
      pagination={pagination}
      throttle
    >
      {error ? (
        <Grid.EmptyView title="Error" description={error} />
      ) : imageResults.length === 0 ? (
        <Grid.EmptyView title="No Results" description="Search for images or try a different query" />
      ) : (
        <>
          {imageResults.map((result, index) => (
            <Grid.Item
              key={`${result.link}-${index}`}
              content={{ source: result.image.thumbnailLink }}
              title={result.title}
              actions={
                <ActionPanel>
                  <ActionPanel.Section title="Image Actions">
                    <Action.OpenInBrowser url={result.link} title="Open Image" />
                    <Action.OpenInBrowser url={result.image.contextLink} title="Open Source" />
                    <Action 
                      title="Download Image" 
                      onAction={() => downloadImage(result.link, result.title, result.mime || result.fileFormat)} 
                      shortcut={{ modifiers: ["cmd"], key: "d" }}
                    />
                    <Action 
                      title="Copy Image to Clipboard" 
                      onAction={() => copyImageToClipboard(result.link)}
                      shortcut={{ modifiers: ["cmd"], key: "c" }}
                    />
                  </ActionPanel.Section>
                  <ActionPanel.Section title="Copy Actions">
                    <Action.CopyToClipboard content={result.link} title="Copy Image URL" />
                    <Action.CopyToClipboard content={result.image.contextLink} title="Copy Source URL" />
                    <Action.CopyToClipboard content={result.title} title="Copy Title" />
                  </ActionPanel.Section>
                </ActionPanel>
              }
            />
          ))}
          
          {/* Pagination loading is handled by Raycast */}
        </>
      )}
    </Grid>
  );
}
