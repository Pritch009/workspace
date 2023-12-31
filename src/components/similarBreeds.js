import { Title, Box, Card, Text, rem, Container, Group, Flex } from "@mantine/core";
import { useBreeds } from "../APIs/cats";
import similarity from "compute-cosine-similarity";
import { useMemo } from "react";
import { pick } from "../utilities";
import { BreedLinkCard } from "./breedLinkCard";
import { useHideContext } from "../contexts/hideContext";
import { motion } from "framer-motion/dist/framer-motion";
import { AnimatePresence } from "framer-motion/dist/framer-motion";

const SimilarityFields = ["hairless", "adaptability", "affection_level", "child_friendly", "dog_friendly", "energy_level", "grooming", "health_issues", "intelligence", "shedding_level", "social_needs", "stranger_friendly", "vocalisation"];
const BooleanFields = ["hairless", "rare", "suppressed_tail", "short_legs", "hypoallergenic", "experimental", "natural"];
const BooleanFieldWeights = [20, 5, 10, 20, 5, 10, 1];

/**
 * @typedef {import('../APIs/cats').Breed} Breed
 */

/**
 * @typedef SimilarBreedsProps
 * @property {Breed} to
 */

/**
 * Extracts the values needed to perform a comparison from a breed object.
 * @param {Breed} breed 
 * @returns {number[]} 
 */
function extractComparisonVector(breed) {
    return [
        Object.values(pick(breed, BooleanFields.flat())).map((val, index) => val === undefined ? 0 : val * BooleanFieldWeights[index]),
        Object.values(pick(breed, SimilarityFields)).map((val) => val === undefined ? 0 : val)
    ].flat()
}

/**
 * 
 * @param {SimilarBreedsProps} props 
 * @returns {JSX.Element}
 */
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
            pt={rem(32)}
            sx={{
                boxSizing: 'border-box',
                width: '100%',
                '& > *': {
                    boxSizing: 'border-box',
                    padding: rem(16)
                }
            }}
        >
            <Title order={3} maw={rem(1000)} mx='auto'>Similar Breeds</Title>
            <Flex
                pb={rem(64)}
                w='100%'
                sx={{
                    overflow: 'auto'
                }}
            >
                <Flex wrap='nowrap' gap='lg' h={200} justify='start' align='center' mx='auto'>
                    {
                        topSimilar
                            .slice(0, 5)
                            .map(([_, breed], index) => (
                                <MotionBox
                                    variants={{
                                        hidden: {
                                            opacity: 0,
                                            y: 10
                                        },
                                        visible: {
                                            opacity: 1,
                                            y: 0
                                        },
                                        exit: {
                                            opacity: 0,
                                            y: -10
                                        }
                                    }}
                                    initial='hidden'
                                    whileInView='visible'
                                    viewport={{
                                        once: true
                                    }}
                                    exit='exit'
                                    key={`${to?.id}-${index}`}
                                    sx={{ height: 200, width: 200, '&:empty': { display: "none" } }}
                                >
                                    <BreedLinkCard breed={breed} />
                                </MotionBox>
                            ))
                    }
                </Flex>
            </Flex>
        </Box>
    )
}

const MotionBox = motion(Box);