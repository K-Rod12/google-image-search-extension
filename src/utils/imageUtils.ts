import { promises as fs } from "fs";
import path from "path";
import os from "os";
import { showToast, Toast } from "@raycast/api";

// Helper function to get file extension from MIME type
export function getFileExtensionFromMime(mime: string): string {
  const mimeMap: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
    "image/svg+xml": ".svg",
    "image/webp": ".webp",
    "image/bmp": ".bmp",
    "image/tiff": ".tiff",
    "image/x-icon": ".ico"
  };
  
  return mimeMap[mime] || ".jpg"; // Default to .jpg if MIME type is not recognized
}

// Helper function to download an image
export async function downloadImage(imageUrl: string, title: string, mime?: string): Promise<string> {
  try {
    // Show a loading toast
    await showToast({
      style: Toast.Style.Animated,
      title: "Downloading image...",
    });

    // Create a unique filename based on title with the correct extension
    const safeTitle = title.replace(/[^a-z0-9]/gi, "_").toLowerCase().substring(0, 50);
    const timestamp = new Date().getTime();
    const extension = mime ? getFileExtensionFromMime(mime) : ".jpg";
    const filename = `${safeTitle}_${timestamp}${extension}`;
    const downloadsPath = path.join(os.homedir(), "Downloads");
    const filePath = path.join(downloadsPath, filename);

    // Fetch the image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`);
    }

    // Convert the response to a buffer
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Write the buffer to a file
    await fs.writeFile(filePath, buffer);

    // Show success toast
    await showToast({
      style: Toast.Style.Success,
      title: "Image downloaded",
      message: `Saved to Downloads folder as ${filename}`,
    });

    return filePath;
  } catch (error) {
    // Show error toast
    await showToast({
      style: Toast.Style.Failure,
      title: "Download failed",
      message: error instanceof Error ? error.message : "Unknown error",
    });
    throw error;
  }
}

// Helper function to copy image to clipboard
export async function copyImageToClipboard(imageUrl: string): Promise<void> {
  try {
    // Show a loading toast
    await showToast({
      style: Toast.Style.Animated,
      title: "Copying image to clipboard...",
    });

    // Download the image temporarily
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    // We'll need to save the image temporarily
    const tempDir = os.tmpdir();
    const tempFile = path.join(tempDir, `raycast_image_${Date.now()}.jpg`);
    
    // Convert the response to a buffer and save it
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(tempFile, buffer);

    // Use the macOS clipboard to copy the image
    const command = `osascript -e 'set the clipboard to (read (POSIX file "${tempFile}") as «class PNGf»)'`;
    const { exec } = require("child_process");
    
    exec(command, async (error: any) => {
      // Clean up the temp file
      try {
        await fs.unlink(tempFile);
      } catch (err) {
        console.error("Failed to delete temp file:", err);
      }

      if (error) {
        await showToast({
          style: Toast.Style.Failure,
          title: "Failed to copy image",
          message: error.message,
        });
        return;
      }
      
      await showToast({
        style: Toast.Style.Success,
        title: "Image copied to clipboard",
      });
    });
  } catch (error) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Failed to copy image",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
