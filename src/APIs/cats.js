import axios from "axios";
import useAxios from "axios-hooks";

//documentation @https://docs.thecatapi.com/
//feel free to add more functions!

const cats = {
  searchCats: async (searchValue) => {
    // Searching by breed name
    return (
      await axios.get("https://api.thecatapi.com/v1/images/search?limit=100")
    )?.data?.results;
  },
  get100Cats: async () => {
    try {
      const response = await axios.get(
        "https://api.thecatapi.com/v1/images/search?limit=100"
      );
      return response.data.results;
    } catch (error) {
      return error;
    }
  },
  getRandomCat: async () => {
    try {
      const response = await axios.get(
        "https://api.thecatapi.com/v1/images/search"
      );
      return response.data.results;
    } catch (error) {
      return error;
    }
  },
  getBreeds: async () => {
    return (await axios.get("https://api.thecatapi.com/v1/breeds"))?.data
      ?.results;
  },
};

export function useBreeds() {
  return useAxios(
    {
      url: "https://api.thecatapi.com/v1/breeds",
      method: "GET",
    },
    { manual: false }
  )[0];
}

export function useBreedImageUrl(breed_id) {
  const [{ data }] = useAxios(
    {
      url: `https://api.thecatapi.com/v1/images/search?breed_ids=${breed_id}`,
      method: "GET",
    },
    { manual: false }
  );
  
  return data?.[0]?.url
}

export default cats;
