"use client";

import SideBar from "@/components/navbar/Sidebar";
import Todos from "@/components/todos/todos";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Search() {
  const { searchQuery } = useParams<{ searchQuery?: string }>();

  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchInProgress, setSearchInProgress] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleSearch = async () => {
      if (!searchQuery) return;

      setSearchResults([]);
      setSearchInProgress(true);
      setError(null);

      try {
        const response = await axios.get(`http://localhost:5000/search`, {
          params: { query: searchQuery },
        });
        setSearchResults(response.data);
      } catch (error) {
        console.error("Error searching tasks:", error);
        setError("An error occurred while fetching search results.");
      } finally {
        setSearchInProgress(false);
      }
    };

    handleSearch();
  }, [searchQuery]);

  return (
    <div>
      <SideBar />
      <Todos items={searchResults} />
      {searchInProgress && <p>Loading...</p>}
      {error && <p>{error}</p>}
    </div>
  );
}

