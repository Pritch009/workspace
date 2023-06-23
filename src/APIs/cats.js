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

export function useBreed(breedId) {
  const breeds = useBreeds();
  if (breeds.loading) {
    return {};
  }
  if (breeds.data) {
    console.log("Breeds: ", breeds.data);
    const breed = breeds.data.find(
      (breed) => breed.id.localeCompare(breedId) === 0
    );

    if (!breed) {
      console.log(`Could not find ${breedId} in breeds: ${breeds.data.map(({ id }) => id)}`)
      return { error: `Unknown breed: ${breedId}` };
    }

    return { breed };
  } else {
    return { error: breeds.error ?? "Unknown error occurred while fetching breed!" };
  }
}

export function useBreedImageUrl(breedId, limit = 1) {
  const [{ data, error }] = useAxios(
    {
      url: `https://api.thecatapi.com/v1/images/search?limit=${limit}&breed_ids=${breedId}`,
      method: "GET",
    },
    { manual: false }
  );

  return data ?? [];
}

export default cats;
