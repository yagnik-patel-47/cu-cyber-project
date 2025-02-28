// National Vulnerability Database (NVD) API client

const NVD_API_URL = "https://services.nvd.nist.gov/rest/json/cves/2.0";
const NVD_API_KEY =
  process.env.NVD_API_KEY;

export interface Vulnerability {
  id: string;
  published: string;
  lastModified: string;
  vulnStatus: string;
  descriptions: Array<{
    lang: string;
    value: string;
  }>;
  metrics?: {
    cvssMetricV31?: Array<{
      cvssData: {
        baseScore: number;
        baseSeverity: string;
      };
    }>;
    cvssMetricV30?: Array<{
      cvssData: {
        baseScore: number;
        baseSeverity: string;
      };
    }>;
  };
}

export interface NvdResponse {
  resultsPerPage: number;
  startIndex: number;
  totalResults: number;
  format: string;
  version: string;
  timestamp: string;
  vulnerabilities: Array<{
    cve: Vulnerability;
  }>;
}

export async function getRecentVulnerabilities(
  limit = 10,
): Promise<Vulnerability[]> {
  // Get vulnerabilities sorted by publication date (latest first)
  const params = new URLSearchParams({
    resultsPerPage: limit.toString(),
    sortBy: "publishDate",
    sortOrder: "desc", // Sort in descending order (newest first)
  });

  try {
    // Add a timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    
    const response = await fetch(`${NVD_API_URL}?${params.toString()}`, {
      headers: {
        apiKey: NVD_API_KEY as string,
      },
      signal: controller.signal,
      cache: 'force-cache',
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`NVD API error: ${response.status} ${response.statusText}`);
    }

    const data: NvdResponse = await response.json();
    
    // Return empty array if no vulnerabilities found
    if (!data.vulnerabilities || !Array.isArray(data.vulnerabilities)) {
      console.warn("No vulnerabilities data returned from NVD API");
      return [];
    }
    
    return data.vulnerabilities.map((v) => v.cve);
  } catch (error) {
    console.error("Error fetching vulnerabilities:", error);
    // Return mock data for demonstration if API fails
    if (process.env.NODE_ENV === 'development') {
      return getMockVulnerabilities();
    }
    return [];
  }
}

// Mock data function for development/fallback
function getMockVulnerabilities(): Vulnerability[] {
  return [
    {
      id: "CVE-2023-38831",
      published: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      lastModified: new Date().toISOString(),
      vulnStatus: "Analyzed",
      descriptions: [
        {
          lang: "en",
          value: "Buffer overflow vulnerability in network protocol implementation allowing remote code execution"
        }
      ],
      metrics: {
        cvssMetricV31: [
          {
            cvssData: {
              baseScore: 7.2,
              baseSeverity: "HIGH"
            }
          }
        ]
      }
    },
    {
      id: "CVE-2023-42824",
      published: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      lastModified: new Date().toISOString(),
      vulnStatus: "Analyzed",
      descriptions: [
        {
          lang: "en",
          value: "Authentication bypass vulnerability in web application framework"
        }
      ],
      metrics: {
        cvssMetricV31: [
          {
            cvssData: {
              baseScore: 8.1,
              baseSeverity: "HIGH"
            }
          }
        ]
      }
    }
  ];
}

export async function getTrendingThreats(
  limit = 6,
): Promise<Vulnerability[]> {
  // Get high and critical severity vulnerabilities, sorted by newest first
  const params = new URLSearchParams({
    resultsPerPage: limit.toString(),
    cvssV3Severity: "HIGH,CRITICAL", // Only high and critical severity
    sortBy: "publishDate",
    sortOrder: "desc" // Sort in descending order (newest first)
  });

  try {
    // Add a timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    
    const response = await fetch(`${NVD_API_URL}?${params.toString()}`, {
      headers: {
        apiKey: NVD_API_KEY as string,
      },
      signal: controller.signal,
      cache: 'force-cache', // Use cache more aggressively
      next: { revalidate: 7200 }, // Revalidate every 2 hours
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`NVD API error: ${response.status} ${response.statusText}`);
    }

    const data: NvdResponse = await response.json();
    
    // Return empty array if no vulnerabilities found
    if (!data.vulnerabilities || !Array.isArray(data.vulnerabilities)) {
      console.warn("No vulnerabilities data returned from NVD API");
      return [];
    }
    
    return data.vulnerabilities.map((v) => v.cve);
  } catch (error) {
    console.error("Error fetching trending threats:", error);
    // Return mock data for demonstration if API fails
    if (process.env.NODE_ENV === 'development') {
      return getMockTrendingThreats();
    }
    return [];
  }
}

// Mock data function for development/fallback
function getMockTrendingThreats(): Vulnerability[] {
  return [
    {
      id: "CVE-2023-36036",
      published: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      lastModified: new Date().toISOString(),
      vulnStatus: "Analyzed",
      descriptions: [
        {
          lang: "en",
          value: "Critical vulnerability in a popular web framework allowing remote code execution"
        }
      ],
      metrics: {
        cvssMetricV31: [
          {
            cvssData: {
              baseScore: 9.8,
              baseSeverity: "CRITICAL"
            }
          }
        ]
      }
    },
    {
      id: "CVE-2023-41179",
      published: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      lastModified: new Date().toISOString(),
      vulnStatus: "Analyzed",
      descriptions: [
        {
          lang: "en",
          value: "SQL injection vulnerability in database connector allowing unauthorized data access"
        }
      ],
      metrics: {
        cvssMetricV31: [
          {
            cvssData: {
              baseScore: 8.4,
              baseSeverity: "HIGH"
            }
          }
        ]
      }
    }
  ];
}

export async function searchVulnerabilities(
  keyword: string,
  limit = 20,
): Promise<Vulnerability[]> {
  const params = new URLSearchParams({
    keyword,
    resultsPerPage: limit.toString(),
  });

  try {
    const response = await fetch(`${NVD_API_URL}?${params.toString()}`, {
      headers: {
        apiKey: NVD_API_KEY as string,
      },
    });

    if (!response.ok) {
      throw new Error(`NVD API error: ${response.status}`);
    }

    const data: NvdResponse = await response.json();
    return data.vulnerabilities.map((v) => v.cve);
  } catch (error) {
    console.error("Error searching vulnerabilities:", error);
    return [];
  }
}
