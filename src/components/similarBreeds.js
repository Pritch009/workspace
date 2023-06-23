import { Title, Box, Card, Text, rem, Container, Group } from "@mantine/core";
import { useBreeds } from "../APIs/cats";
import similarity from "compute-cosine-similarity";
import { useMemo } from "react";
import { pick } from "../utilities";
import { BreedLinkCard } from "./breedLinkCard";

const SimilarityFields = ["hairless", "adaptability", "affection_level", "child_friendly", "dog_friendly", "energy_level", "grooming", "health_issues", "intelligence", "shedding_level", "social_needs", "stranger_friendly", "vocalisation"];
const BooleanFields = ["hairless", "rare", "suppressed_tail", "short_legs", "hypoallergenic", "experimental", "natural"];
const BooleanFieldWeights = [10, 5, 10, 10, 5, 10, 1];

function extractComparisonVector(breed) {
    return [
        Object.values(pick(breed, BooleanFields.flat())).map((val, index) => val === undefined ? 0 : val * BooleanFieldWeights[index]),
        Object.values(pick(breed, SimilarityFields)).map((val) => val === undefined ? 0 : val)
    ].flat()
}

export function SimilarBreeds({ to }) {
    const breeds = useBreeds();

    const top5 = useMemo(() => {
        if (!breeds.data) {
            return [];
        }
        const toVec = extractComparisonVector(to);
        return breeds.data.map((breed) => {
            if (breed.id === to.id) {
                return [0, breed];
            }
            return [similarity(
                extractComparisonVector(breed),
                toVec
            ), breed]
        }).sort(([a], [b]) => b - a).slice(0, 5);
    }, [breeds, to]);

    return (
        <Box
            sx={{
                boxSizing: 'border-box',
            }}
        >
            <Title order={4}>Similar Breeds</Title>
            <Box
                py={rem(32)}
                sx={{
                    maxWidth: '100%',
                    overflow: 'auto',
                }}
            >
                <Box
                    sx={{
                        width: 'max-content',
                        display: 'flex',
                        flexWrap: 'nowrap',
                        gap: rem(16),
                        height: rem(200),
                    }}
                >
                    {
                        top5.map(([_, breed]) => (
                            <Box key={breed.id} sx={{ height: 200, width: 200 }}>
                                <BreedLinkCard breed={breed} />
                            </Box>
                        ))
                    }
                </Box>
            </Box>
        </Box>
    )
}