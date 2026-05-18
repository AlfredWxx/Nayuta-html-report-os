/**
 * GitHub API Wrapper for Report Publishing
 */

import { Octokit } from '@octokit/rest';

// Initialize Octokit with GitHub token
function getOctokit(): Octokit {
  const token = process.env.GITHUB_TOKEN;
  
  if (!token) {
    throw new Error('GITHUB_TOKEN environment variable is not set');
  }
  
  return new Octokit({
    auth: token,
  });
}

// Get repository config from environment
function getRepoConfig() {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';
  
  if (!owner || !repo) {
    throw new Error('GITHUB_OWNER and GITHUB_REPO environment variables must be set');
  }
  
  return { owner, repo, branch };
}

/**
 * Check if a file exists in the repository
 */
export async function fileExists(path: string): Promise<boolean> {
  try {
    const octokit = getOctokit();
    const { owner, repo, branch } = getRepoConfig();
    
    await octokit.rest.repos.getContent({
      owner,
      repo,
      path,
      ref: branch,
    });
    
    return true;
  } catch (error: any) {
    if (error.status === 404) {
      return false;
    }
    throw error;
  }
}

/**
 * Create a new file in the repository
 */
export async function createFile(
  path: string,
  content: string,
  message: string
): Promise<{ sha: string; url: string }> {
  const octokit = getOctokit();
  const { owner, repo, branch } = getRepoConfig();
  
  // Encode content to base64
  const encodedContent = Buffer.from(content).toString('base64');
  
  const response = await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message,
    content: encodedContent,
    branch,
  });
  
  return {
    sha: response.data.content?.sha || '',
    url: response.data.content?.html_url || '',
  };
}

/**
 * Update an existing file in the repository
 */
export async function updateFile(
  path: string,
  content: string,
  message: string,
  sha: string
): Promise<{ sha: string; url: string }> {
  const octokit = getOctokit();
  const { owner, repo, branch } = getRepoConfig();
  
  // Encode content to base64
  const encodedContent = Buffer.from(content).toString('base64');
  
  const response = await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message,
    content: encodedContent,
    sha,
    branch,
  });
  
  return {
    sha: response.data.content?.sha || '',
    url: response.data.content?.html_url || '',
  };
}

/**
 * Get file content and SHA (for updates)
 */
export async function getFile(path: string): Promise<{ content: string; sha: string } | null> {
  try {
    const octokit = getOctokit();
    const { owner, repo, branch } = getRepoConfig();
    
    const response = await octokit.rest.repos.getContent({
      owner,
      repo,
      path,
      ref: branch,
    });
    
    // Handle file content
    if ('content' in response.data && !Array.isArray(response.data)) {
      const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
      return {
        content,
        sha: response.data.sha,
      };
    }
    
    return null;
  } catch (error: any) {
    if (error.status === 404) {
      return null;
    }
    throw error;
  }
}

/**
 * Create or update file (upsert operation)
 */
export async function upsertFile(
  path: string,
  content: string,
  message: string
): Promise<{ sha: string; url: string; created: boolean }> {
  const existing = await getFile(path);
  
  if (existing) {
    // Update existing file
    const result = await updateFile(path, content, message, existing.sha);
    return { ...result, created: false };
  } else {
    // Create new file
    const result = await createFile(path, content, message);
    return { ...result, created: true };
  }
}

/**
 * Generate public URL for a report
 */
export function generateReportUrl(folderPath: string, reportId: string): string {
  const siteUrl = process.env.SITE_URL || '';
  
  // Remove trailing slash from siteUrl
  const baseUrl = siteUrl.replace(/\/$/, '');
  
  // Construct path
  const path = folderPath ? `${folderPath}/${reportId}` : reportId;
  
  return `${baseUrl}/reports/${path}`;
}