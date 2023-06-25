import axios from "axios";
import useAxios from "axios-hooks";
import { useEffect } from "react";
import { useLocalState } from "../hooks/useLocalState";
import { useCoupledState } from "../hooks/useCoupledState";
import { pick } from "../utilities";

/*
weight	
imperial	"7  -  10"
metric	"3 - 5"
id	"abys"
name	"Abyssinian"
cfa_url	"http://cfa.org/Breeds/BreedsAB/Abyssinian.aspx"
vetstreet_url	"http://www.vetstreet.com/cats/abyssinian"
vcahospitals_url	"https://vcahospitals.com/know-your-pet/cat-breeds/abyssinian"
temperament	"Active, Energetic, Independent, Intelligent, Gentle"
origin	"Egypt"
country_codes	"EG"
country_code	"EG"
description	"The Abyssinian is easy to care for, and a joy to have in your home. They’re affectionate cats and love both people and other animals."
life_span	"14 - 15"
indoor	0
lap	1
alt_names	""
adaptability	5
affection_level	5
child_friendly	3
dog_friendly	4
energy_level	5
grooming	1
health_issues	2
intelligence	5
shedding_level	2
social_needs	5
stranger_friendly	5
vocalisation	1
experimental	0
hairless	0
natural	1
rare	0
rex	0
suppressed_tail	0
short_legs	0
wikipedia_url	"https://en.wikipedia.org/wiki/Abyssinian_(cat)"
hypoallergenic	0
reference_image_id	"0XYvRd7oD"
*/

/**
 * @typedef {Object} Breed
 * @property {{
 *  imperial: string,
  *  metric: string
  * }} weight
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string} temperament
 * @property {string} origin
 * @property {string} life_span
 * @property {string} alt_names
 * @property {string} wikipedia_url
 * @property {string} cfa_url
 * @property {string} vetstreet_url
 * @property {string} vcahospitals_url
 * @property {string} country_code
 * @property {string} country_codes
 * @property {string} breed_group
 * @property {number} indoor
 * @property {number} lap
 * @property {number} adaptability
 * @property {number} affection_level
 * @property {number} child_friendly
 * @property {number} dog_friendly
 * @property {number} energy_level
 * @property {number} grooming
 * @property {number} health_issues
 * @property {number} intelligence
 * @property {number} shedding_level
 * @property {number} social_needs
 * @property {number} stranger_friendly
 * @property {number} vocalisation
 * @property {number} experimental
 * @property {number} hairless
 * @property {number} natural
 * @property {number} rare
 * @property {number} rex
 * @property {number} suppressed_tail
 * @property {number} short_legs
 * @property {number} reference_image_id
 * @property {number} hypoallergenic
 */

//documentation @https://docs.thecatapi.com/
//feel free to add more functions!
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
    const breed = breeds.data.find(
      (breed) => breed.id.localeCompare(breedId) === 0
    );

    if (!breed) {
      return { error: `Unknown breed: ${breedId}` };
    }

    return { breed };
  } else {
    return { error: breeds.error ?? "Unknown error occurred while fetching breed!" };
  }
}

export function useBreedReferenceImage(reference_image_id) {
  const [state, setState] = useLocalState(`image.${reference_image_id}`, null);
  const [{ data }, fetch] = useAxios(
    {
      url: `https://api.thecatapi.com/v1/images/${reference_image_id}`,
      method: "GET",
    },
    { manual: true, }
  );

  useEffect(() => {
    if (reference_image_id && !state) {
      fetch();
    }
  }, [reference_image_id]);

  useEffect(() => {
    if (data) {
      setState(pick(data, ['url']));
    }
  }, [data]);

  return state ?? null;
}

export function useBreedImageUrl(breedId, limit = 1) {
  const [state, setState] = useLocalState(`carousel.${breedId}`, null);
  const [{ data }] = useAxios(
    {
      url: `https://api.thecatapi.com/v1/images/search?limit=${limit}&breed_ids=${breedId}`,
      method: "GET",
    },
    { manual: false }
  );

  useEffect(() => {
    if (data) {
      setState(data.map((image) => pick(image, ['url'])));
    }
  }, [data]);

  return data ?? [];
}
