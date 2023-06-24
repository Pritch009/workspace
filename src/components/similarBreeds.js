import { Title, Box, Card, Text, rem, Container, Group, Flex } from "@mantine/core";
import { useBreeds } from "../APIs/cats";
import similarity from "compute-cosine-similarity";
import { useMemo } from "react";
import { pick } from "../utilities";
import { BreedLinkCard } from "./breedLinkCard";
import { useFilter } from "../contexts/filterContext";
import { useHideContext } from "../contexts/hideContext";

const SimilarityFields = ["hairless", "adaptability", "affection_level", "child_friendly", "dog_friendly", "energy_level", "grooming", "health_issues", "intelligence", "shedding_level", "social_needs", "stranger_friendly", "vocalisation"];
const BooleanFields = ["hairless", "rare", "suppressed_tail", "short_legs", "hypoallergenic", "experimental", "natural"];
const BooleanFieldWeights = [20, 5, 10, 20, 5, 10, 1];

function extractComparisonVector(breed) {
    return [
        Object.values(pick(breed, BooleanFields.flat())).map((val, index) => val === undefined ? 0 : val * BooleanFieldWeights[index]),
        Object.values(pick(breed, SimilarityFields)).map((val) => val === undefined ? 0 : val)
    ].flat()
}

export function SimilarBreeds({ to }) {
    const breeds = useBreeds();
    const [hidden] = useHideContext();

    const topSimilar = useMemo(() => {
        if (!to || !breeds.data) {
            return [];
        }
        const toVec = extractComparisonVector(to);
        return breeds.data
            .filter((breed) => !hidden.has(breed.id))
            .map((breed) => {
                if (breed.id === to.id) {
                    return [0, breed];
                }
                return [similarity(
                    extractComparisonVector(breed),
                    toVec
                ), breed]
            })
            .sort(([a], [b]) => b - a);
    }, [breeds, to, hidden]);

    return (
        <Box
            sx={{
                boxSizing: 'border-box',
                width: '100%'
            }}
        >
            <Title order={4} maw={rem(1000)} mx='auto'>Similar Breeds</Title>
            <Flex
                py={rem(32)}
                w='100%'
                justify='center'
                sx={{
                    overflow: 'auto'
                }}
            >
                <Flex wrap='nowrap' gap='lg' h={rem(200)} w={rem(1000)} maw='100%' justify='start' align='center'                >
                    {
                        topSimilar
                            .slice(0, 5)
                            .map(([_, breed]) => (
                                <Box key={breed.id} sx={{ height: 200, width: 200, '&:empty': { display: "none" } }}>
                                    <BreedLinkCard breed={breed} />
                                </Box>
                            ))
                    }
                </Flex>
            </Flex>
        </Box>
    )
}